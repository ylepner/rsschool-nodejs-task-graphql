import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, typeDefs } from './schemas.js';
import { graphql, buildSchema } from 'graphql';

const schema = buildSchema(typeDefs);



const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req: any) {
      const { query, variables, operationName } = req.body;
      const { prisma, httpErrors } = fastify;
      const resolvers = {
        users: () => {
          return prisma.user.findMany();
        },
        user: async ({ id }) => {

          const q = await prisma.user.findUnique({
            where: {
              id: id,
            },
            include: {
              profile: {
                include: {
                  memberType: true,
                }
              },
              posts: true,
              userSubscribedTo: {
                include: {
                  author: {
                    include: {
                      subscribedToUser: true
                    }
                  },
                },
              },
              subscribedToUser: {
                include: {
                  subscriber: {
                    include: {
                      userSubscribedTo: true
                    }
                  }
                }
              },
            },

          });
          q?.subscribedToUser.forEach(user => {
            user.subscriber.userSubscribedTo.forEach((u) => {
              Object.assign(u, { id: u.authorId })
            })
            Object.assign(user, user.subscriber)
          })
          q?.userSubscribedTo.forEach(user => {
            user.author.subscribedToUser.forEach((u) => {
              Object.assign(u, { id: u.subscriberId })
            })
            Object.assign(user, user.author)
          })
          return q;
        },
        posts: () => {
          return prisma.post.findMany();
        },
        post: ({ id }) => {
          return prisma.post.findUnique({
            where: {
              id: id
            }
          })
        },
        profiles: () => {
          return prisma.profile.findMany();
        },
        profile: ({ id }) => {
          return prisma.profile.findUnique({
            where: {
              id: id
            }
          })
        },
        memberTypes: () => {
          return prisma.memberType.findMany();
        },
        memberType: ({ id }) => {
          return prisma.memberType.findUnique({
            where: {
              id: id
            }
          })
        },
      }
      try {
        const result = await graphql({
          schema,
          source: query,
          rootValue: resolvers,
          contextValue: req, // Useful if you want to access Fastify request in resolvers.
          variableValues: variables,
          operationName: operationName
        });
        return result;

      } catch (e) {
        console.error(e)
        throw e
      }

    },
  });
};


export default plugin;
