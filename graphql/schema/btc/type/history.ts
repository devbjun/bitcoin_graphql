import { schema } from 'nexus'
import { JSONScalar } from '../../type/json'

export default schema.objectType({
  name: 'btc_history',
  definition(t) {
    t.string('address')
    t.int('balance')
    t.list.field('utxo', {
      type: JSONScalar
    })
  },
})
