import { PrismaClient } from "@prisma/client";

const deleteUser = async (id) => {
  const prisma = new PrismaClient();
  try {
    await prisma.review.deleteMany({
      where: {
        userId: id,
      },
    });

    await prisma.booking.deleteMany({
      where: {
        userId: id,
      },
    });

    const user = await prisma.user.deleteMany({
      where: {
        id,
      },
    });

    return user.count > 0 ? id : null;
  } catch (error) {
    throw new Error(error);
  }
};

export default deleteUser;
