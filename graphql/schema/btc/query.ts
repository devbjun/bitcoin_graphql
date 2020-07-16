import { core, intArg, stringArg } from '@nexus/schema'
import { payments } from 'bitcoinjs-lib'
import axios from 'axios'

import btcAddress from './type/address'
import btcBalance from './type/balance'
import btcUtxo from './type/utxo'
import btcHistory from './type/history'
import btcTxHistory from './type/tx_history'

import config from '../../../config/wallet'

const getRoot = (path: string) => config.root.derivePath(path)
const getAddress = (): core.NexusOutputFieldConfig<'Query', 'btc_address'> & {
  resolve: core.FieldResolver<'Query', 'btc_address'>
} => {
  return {
    type: btcAddress,
    args: {
      id: intArg({ required: true }),
    },
    async resolve(_, args): Promise<any> {
      return {
        id: args.id,
        address: payments.p2sh({
          redeem: payments.p2wpkh({
            pubkey: getRoot(`m/44'/0'/${args.id}'/0/0`).publicKey,
            network: config.network,
          }),
        }).address
      }
    },
  }
}

const getBalance = (): core.NexusOutputFieldConfig<'Query', 'btc_balance'> & {
  resolve: core.FieldResolver<'Query', 'btc_balance'>
} => {
  return {
    type: btcBalance,
    args: {
      id: intArg({ required: true })
    },
    async resolve(_, args, ctx, info): Promise<any> {
      const address = (await getAddress().resolve(_, args, ctx, info))?.address?.toString()
      const result = await axios
        .get(
          `https://api.blockchair.com/bitcoin/testnet/dashboards/address/${address}?transaction_details=true`,
        )
        .catch((err) => console.log(err))

      if (result && address) { 
        return {
          address: address,
          balance: result.data.data[address].address.balance
        }
      }

      return null
    },
  }
}

const getUTXO = (): core.NexusOutputFieldConfig<'Query', 'btc_utxo'> & {
  resolve: core.FieldResolver<'Query', 'btc_utxo'>
} => {
  return {
    type: btcUtxo,
    args: {
      id: intArg({ required: true })
    },
    async resolve(_, args, ctx, info): Promise<any> {
      const address = (await getAddress().resolve(_, args, ctx, info))?.address?.toString()
      const result = await axios
        .get(
          `https://api.blockchair.com/bitcoin/testnet/dashboards/address/${address}?transaction_details=true`,
        )
        .catch((err) => console.log(err))

      if (result && address) { 
        return {
          address: address,
          utxo: result.data.data[address].utxo
        }
      }

      return null
    },
  }
}

const getHistory = (): core.NexusOutputFieldConfig<'Query', 'btc_history'> & {
  resolve: core.FieldResolver<'Query', 'btc_history'>
} => {
  return {
    type: btcHistory,
    args: {
      id: intArg({ required: true })
    },
    async resolve(_, args, ctx, info): Promise<any> {
      const address = (await getAddress().resolve(_, args, ctx, info))?.address?.toString()
      const result = await axios
        .get(
          `https://api.blockchair.com/bitcoin/testnet/dashboards/address/${address}?transaction_details=true`,
        )
        .catch((err) => console.log(err))

      if (result && address) { 
        return {
          address: address,
          balance: result.data.data[address].address.balance,
          utxo: result.data.data[address].utxo
        }
      }

      return null
    },
  }
}

const getTxHistory = (): core.NexusOutputFieldConfig<'Query', 'btc_tx_history'> & {
  resolve: core.FieldResolver<'Query', 'btc_tx_history'>
} => {
  return {
    type: btcTxHistory,
    args: {
      txId: stringArg({ required: true })
    },
    async resolve(_, args): Promise<any> {
      const result = await axios
        .get(
          `https://api.blockchair.com/bitcoin/testnet/dashboards/transaction/${args.txId}`,
        )
        .catch((err) => console.log(err))

      if (result) { 
        return {
          data: result.data.data == [] ? null : result.data.data[args.txId]
        }
      }

      return null
    },
  }
}

export default { getRoot, getAddress, getBalance, getUTXO, getHistory, getTxHistory }