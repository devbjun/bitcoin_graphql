import { schema } from 'nexus'
import { JSONScalar } from '../../type/json'

export default schema.objectType({
  name: 'btc_utxo',
  definition(t) {
    t.string('address')
    t.list.field('utxo', {
      type: JSONScalar
    })
  },
})
