import { schema } from 'nexus'

export default schema.objectType({
  name: 'btc_balance',
  definition(t) {
    t.string('address')
    t.float('balance')
  },
})
