import { core } from 'nexus/components/schema'

import BTC from './schema/btc/mutation'

export default (t: core.ObjectDefinitionBlock<'Mutation'>) => {
  t.field('btc_tx_signed', BTC.signedTx())
}