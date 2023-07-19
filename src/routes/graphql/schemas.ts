import { Type } from '@fastify/type-provider-typebox';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const typeDefs = `#graphql
type User {
  id: ID!
  name: String!
  # posts: [Post!]
}

type Post {
  id: ID!
  title: String!
  content: String!
  # author: User!
}

type Query {
  users: [User!]!
  posts: [Post!]!
}
`