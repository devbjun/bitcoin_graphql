import { core, intArg, stringArg } from '@nexus/schema'
import { payments } from 'bitcoinjs-lib'
import axios from 'axios'

import address from './type/address'
import balance from './type/balance'
import utxo from './type/utxo'

import config from '../../../config/wallet'

const getRoot = (path: string) => config.root.derivePath(path)
const getAddress = (): core.NexusOutputFieldConfig<'Query', 'btc_address'> & {
  resolve: core.FieldResolver<'Query', 'btc_address'>
} => {
  return {
    type: address,
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
    type: balance,
    args: {
      address: stringArg({ required: true }),
    },
    async resolve(_, args): Promise<any> {
      const result = await axios
        .get(
          `https://api.blockchair.com/bitcoin/testnet/dashboards/address/${args.address}?transaction_details=true`,
        )
        .catch((err) => console.log(err))

      if (result) { 
        return {
          address: args.address,
          balance: result.data.data[args.address].address.balance
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
    type: utxo,
    args: {
      address: stringArg({ required: true }),
    },
    async resolve(_, args): Promise<any> {
      const result = await axios
        .get(
          `https://api.blockchair.com/bitcoin/testnet/dashboards/address/${args.address}?transaction_details=true`,
        )
        .catch((err) => console.log(err))

      if (result) { 
        return {
          address: args.address,
          utxo: result.data.data[args.address].utxo
        }
      }

      return null
    },
  }
}

export default { getAddress, getBalance, getUTXO }