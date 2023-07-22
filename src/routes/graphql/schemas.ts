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

scalar UUID

type User {
  id: UUID!
  name: String!
  balance: Float!
  # posts: [Post!]
}

type Post {
  id: UUID!
  title: String!
  content: String!
  # author: User!
}

type Profile {
  id: UUID!
  isMale: Boolean!
  yearOfBirth: Int!,
  # userId: String!
  # memberTypeId: String!
}

enum MemberTypeId {
  basic,
  business,
}

type MemberType {
  id: MemberTypeId!
  discount: Float!
  postsLimitPerMonth: Int!
}

type Query {
  users: [User]
  user(id: UUID!): User
  posts: [Post]
  post(id: UUID!): Post
  profiles: [Profile]
  profile(id: UUID!): Profile
  memberTypes: [MemberType]
  memberType(id: MemberTypeId!): MemberType
}
`

/*
  {
        memberTypes {
            id
            discount
            postsLimitPerMonth
        }
        posts {
            id
            title
            content
        }
        users {
            id
            name
            balance
        }
        profiles {
            id
            isMale
            yearOfBirth
        }
    }
 
 */