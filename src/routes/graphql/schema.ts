import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import {
  MemberTypeType,
  PostType,
  ProfileType,
  UserType,
  MemberTypeIdEnum,
  CreateUserInput,
  ChangeUserInput,
  CreateProfileInput,
  ChangeProfileInput,
  CreatePostInput,
  ChangePostInput,
} from './schema-types.js';

export const createSchema = (prisma) => {
  const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType))),
        resolve: async () => {
          return prisma.memberType.findMany();
        },
      },
      memberType: {
        type: MemberTypeType,
        args: {
          id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
        },
        resolve: async (_, { id }) => {
          return prisma.memberType.findUnique({
            where: { id },
          });
        },
      },
      users: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
        resolve: async () => {
          return prisma.user.findMany();
        },
      },
      user: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { id }) => {
          return prisma.user.findUnique({
            where: { id },
          });
        },
      },
      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
        resolve: async () => {
          return prisma.post.findMany();
        },
      },
      post: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { id }) => {
          return prisma.post.findUnique({
            where: { id },
          });
        },
      },
      profiles: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
        resolve: async () => {
          return prisma.profile.findMany();
        },
      },
      profile: {
        type: ProfileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { id }) => {
          return prisma.profile.findUnique({
            where: { id },
          });
        },
      },
    },
  });

  const Mutations = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
      createUser: {
        type: new GraphQLNonNull(UserType),
        args: {
          dto: { type: new GraphQLNonNull(CreateUserInput) },
        },
        resolve: async (_, { dto }) => {
          return prisma.user.create({
            data: dto,
          });
        },
      },
      createProfile: {
        type: new GraphQLNonNull(ProfileType),
        args: {
          dto: { type: new GraphQLNonNull(CreateProfileInput) },
        },
        resolve: async (_, { dto }) => {
          return prisma.profile.create({
            data: dto,
          });
        },
      },
      createPost: {
        type: new GraphQLNonNull(PostType),
        args: {
          dto: { type: new GraphQLNonNull(CreatePostInput) },
        },
        resolve: async (_, { dto }) => {
          return prisma.post.create({
            data: dto,
          });
        },
      },
      changeUser: {
        type: new GraphQLNonNull(UserType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeUserInput) },
        },
        resolve: async (_, { id, dto }) => {
          return prisma.user.update({
            where: { id },
            data: dto,
          });
        },
      },
      changeProfile: {
        type: new GraphQLNonNull(ProfileType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeProfileInput) },
        },
        resolve: async (_, { id, dto }) => {
          return prisma.profile.update({
            where: { id },
            data: dto,
          });
        },
      },
      changePost: {
        type: new GraphQLNonNull(PostType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangePostInput) },
        },
        resolve: async (_, { id, dto }) => {
          return prisma.post.update({
            where: { id },
            data: dto,
          });
        },
      },
      deleteUser: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { id }) => {
          await prisma.user.delete({
            where: { id },
          });
          return "User deleted";
        },
      },
      deleteProfile: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { id }) => {
          await prisma.profile.delete({
            where: { id },
          });
          return "Profile deleted";
        },
      },
      deletePost: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { id }) => {
          await prisma.post.delete({
            where: { id },
          });
          return "Post deleted";
        },
      },
      subscribeTo: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { userId, authorId }) => {
          await prisma.subscribersOnAuthors.create({
            data: {
              subscriberId: userId,
              authorId,
            },
          });
          return "Subscribed";
        },
      },
      unsubscribeFrom: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { userId, authorId }) => {
          await prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: userId,
                authorId,
              },
            },
          });
          return "Unsubscribed";
        },
      },
    },
  });

  return new GraphQLSchema({
    query: RootQueryType,
    mutation: Mutations,
  });
};