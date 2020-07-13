import { core } from 'nexus/components/schema'

import BTC from './schema/btc/query'

export default (t: core.ObjectDefinitionBlock<'Query'>) => {
  /**
   * 이하는 Single Query
   */
  t.field('btc_address', BTC.getAddress())
  t.field('btc_balance', BTC.getBalance())
  t.field('btc_utxo', BTC.getUTXO())
}
