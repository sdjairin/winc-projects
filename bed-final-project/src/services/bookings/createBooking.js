import { PrismaClient } from "@prisma/client";

const createBooking = async (
  checkinDate,
  checkoutDate,
  numberOfGuests,
  totalPrice,
  bookingStatus,
  userId,
  propertyId
) => {
  const prisma = new PrismaClient();
  const newBooking = {
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice,
    bookingStatus,
    userId,
    propertyId,
  };

  const booking = await prisma.booking.create({
    data: newBooking,
  });

  return booking;
};

export default createBooking;
