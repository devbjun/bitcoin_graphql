import { makeSchema } from '@nexus/schema'
import { schema } from 'nexus'

import Query from './graphql/query'

export default makeSchema({
  types: [
    schema.queryType({
      definition: Query,
    })
  ],
})
