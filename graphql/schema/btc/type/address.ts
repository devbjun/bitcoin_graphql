import { schema } from 'nexus'

export default schema.objectType({
  name: 'btc_address',
  definition(t) {
    t.int('id')
    t.string('address')
  },
})
