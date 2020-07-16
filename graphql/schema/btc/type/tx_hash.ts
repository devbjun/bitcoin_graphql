import { schema } from 'nexus'
import { JSONScalar } from '../../type/json'

export default schema.objectType({
  name: 'btc_tx_hash',
  definition(t) {
    t.string('txHash')
  },
})
