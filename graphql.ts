import { makeSchema } from '@nexus/schema'
import { schema } from 'nexus'

import * as path from 'path'

import Query from './graphql/query'
import Mutation from './graphql/mutation'

export default makeSchema({
  types: [
    schema.queryType({
      definition: Query,
    }),
    schema.mutationType({
      definition: Mutation
    })
  ],
  outputs: {
    schema: path.join(__dirname, '/generated/schema.gen.graphql'),
  }
})
