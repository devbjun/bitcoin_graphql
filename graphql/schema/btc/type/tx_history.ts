import { schema } from 'nexus'
import { JSONScalar } from '../../type/json'

export default schema.objectType({
  name: 'btc_tx_history',
  definition(t) {
    t.field('data', {
      type: JSONScalar
    })
  },
})
