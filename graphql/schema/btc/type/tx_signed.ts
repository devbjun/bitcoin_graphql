import { schema } from 'nexus'

export default schema.objectType({
  name: 'btc_tx_signed',
  definition(t) {
    t.string('txHash')
    t.string('signedTx')
  },
})
