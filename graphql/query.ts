import { core } from 'nexus/components/schema'

import BTC from './schema/btc/query'

export default (t: core.ObjectDefinitionBlock<'Query'>) => {
  t.field('btc_address', BTC.getAddress())
  t.field('btc_balance', BTC.getBalance())
  t.field('btc_utxo', BTC.getUTXO())
  t.field('btc_history', BTC.getHistory())

  t.field('btc_tx_history', BTC.getTxHistory())
}
