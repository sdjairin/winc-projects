import { PrismaClient } from "@prisma/client";

const deleteHost = async (id) => {
  const prisma = new PrismaClient();

  try {
    // Delete the host
    const host = await prisma.host.deleteMany({
      where: {
        id,
      },
    });

    return host.count > 0 ? id : null;
  } catch (error) {
    throw new Error(error);
  }
};

export default deleteHost;
