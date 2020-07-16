import { core, intArg, stringArg } from '@nexus/schema'
import { payments, Psbt, crypto, address as validation } from 'bitcoinjs-lib'
import axios from 'axios'

import BTC from './query'

import btcTxSigned from './type/tx_signed'

import config from '../../../config/wallet'

const signedTx = (): core.NexusOutputFieldConfig<'Mutation', 'btc_tx_signed'> & {
  resolve: core.FieldResolver<'Mutation', 'btc_tx_signed'>
} => {
  return {
    type: btcTxSigned,
    args: {
      id: intArg({ required: true }),
      outputs: stringArg({ required: true }),
      fee: intArg({ required: true })
    },
    async resolve(_, args, ctx, info): Promise<any> {

      const outputs = JSON.parse(args.outputs)
      const outputBalance = outputs.map((item: { [key: string]: any }) => item.value).reduce((prev: number, curr: number) => prev + curr)

      const history = await BTC.getHistory().resolve(_, { id: args.id }, ctx, info)
      const address = history?.address?.toString()
      const balance = history?.balance?.toString()
      const utxo = history?.utxo

      // Balance Checking
      if (address && balance && utxo && parseFloat(balance) >= outputBalance + args.fee) {

        // Address Checking
        outputs.map((data: { [key: string]: any }) => validation.fromBase58Check(data.address))

        const redeemScript = payments.p2wpkh({
          pubkey: BTC.getRoot(`m/44'/0'/${args.id}'/0/0`).publicKey,
          network: config.network,
        }).output

        const inputs = (<any[]> utxo).map((utx: { [key: string]: any }) => {
          return {
            hash: utx.transaction_hash,
            index: utx.index,
            witnessUtxo: {
              script: Buffer.from(
                'a914' + crypto.hash160(redeemScript!).toString('hex') + '87',
                'hex',
              ),
              value: utx.value,
            },
            redeemScript: redeemScript,
          }
        })

        outputs.push({
          address: address,
          value: parseInt(balance) - outputBalance - args.fee
        })

        const psbt = new Psbt({ network: config.network })

        psbt.addInputs(inputs)
        psbt.addOutputs(outputs)

        const tx = psbt
          .signAllInputs(BTC.getRoot(`m/44'/0'/${args.id}'/0/0`))
          .finalizeAllInputs()
          .extractTransaction()

        return {
          txHash: tx.getId(),
          signedTx: tx.toHex(),
        }
      }

      return null
    },
  }
}

const sendTx = (): core.NexusOutputFieldConfig<'Mutation', 'btc_tx_send'> & {
  resolve: core.FieldResolver<'Mutation', 'btc_tx_send'>
} => {
  return {
    type: btcTxSigned,
    args: {
      signedTx: stringArg({ required: true })
    },
    async resolve(_, args): Promise<any> {
      const result = await axios({
        method: 'post',
        url: `https://api.blockchair.com/bitcoin/testnet/push/transaction/`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data: JSON.stringify({
          data: args.signedTx,
        }),
      })
  
      return {
        txHash: result.data.data.transaction_hash
      }
    },
  }
}

export default { signedTx, sendTx }