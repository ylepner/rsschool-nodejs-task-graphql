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
        posts: () => {
          return prisma.post.findMany();
        }
      };
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
