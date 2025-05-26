import DataLoader from 'dataloader';

export const createLoaders = (prisma) => {
  const userLoader = new DataLoader(async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: ids as string[] } },
    });
    return ids.map(id => users.find(user => user.id === id) || null);
  });

  const profileByUserIdLoader = new DataLoader(async (userIds: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: userIds as string[] } },
    });
    return userIds.map(userId => profiles.find(profile => profile.userId === userId) || null);
  });

  const postsByAuthorIdLoader = new DataLoader(async (authorIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: authorIds as string[] } },
    });

    const postsByAuthor = authorIds.map(authorId => 
      posts.filter(post => post.authorId === authorId)
    );

    return postsByAuthor;
  });

  const memberTypeLoader = new DataLoader(async (ids: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: ids as string[] } },
    });
    return ids.map(id => memberTypes.find(memberType => memberType.id === id) || null);
  });

  const userSubscribedToLoader = new DataLoader(async (userIds: readonly string[]) => {
    const subscriptions = await prisma.user.findMany({
      where: {
        subscribedToUser: {
          some: {
            subscriberId: { in: userIds as string[] },
          },
        },
      },
      include: {
        subscribedToUser: true,
      },
    });

    const usersBySubscriberId = userIds.map(userId => {
      const relevantUsers = subscriptions.filter(user => 
        user.subscribedToUser.some(sub => sub.subscriberId === userId)
      );
      return relevantUsers;
    });

    return usersBySubscriberId;
  });

  const subscribedToUserLoader = new DataLoader(async (userIds: readonly string[]) => {
    const subscribers = await prisma.user.findMany({
      where: {
        userSubscribedTo: {
          some: {
            authorId: { in: userIds as string[] },
          },
        },
      },
      include: {
        userSubscribedTo: true,
      },
    });

    const usersByAuthorId = userIds.map(userId => {
      const relevantUsers = subscribers.filter(user => 
        user.userSubscribedTo.some(sub => sub.authorId === userId)
      );
      return relevantUsers;
    });

    return usersByAuthorId;
  });

  return {
    userLoader,
    profileByUserIdLoader,
    postsByAuthorIdLoader,
    memberTypeLoader,
    userSubscribedToLoader,
    subscribedToUserLoader,
  };
};
