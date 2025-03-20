import { PrismaClient } from "@prisma/client";

const deleteProperty = async (id) => {
  const prisma = new PrismaClient();

  try {
    await prisma.booking.deleteMany({
      where: {
        propertyId: id,
      },
    });
    const property = await prisma.property.deleteMany({
      where: {
        id,
      },
    });

    return property.count > 0 ? id : null;
  } catch (error) {
    throw new Error(error);
  }
};

export default deleteProperty;
