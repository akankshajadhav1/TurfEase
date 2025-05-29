const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Check availability for a turf on a specific date
 * @route GET /api/bookings/availability/:turfId
 * @access Public
 */
const checkAvailability = async (req, res) => {
  try {
    const { turfId } = req.params;
    const { date } = req.query;

    // Validate turfId
    const turf = await prisma.turf.findUnique({
      where: { id: Number(turfId) },
    });

    if (!turf) {
      return res.status(404).json({
        message: "Turf not found",
      });
    }

    // Parse date
    const bookingDate = new Date(date);

    // Set time to start of day
    bookingDate.setHours(0, 0, 0, 0);

    // Get end of day
    const nextDay = new Date(bookingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get all bookings for this turf on this date
    const bookings = await prisma.booking.findMany({
      where: {
        turfId: Number(turfId),
        date: {
          gte: bookingDate,
          lt: nextDay,
        },
        status: "CONFIRMED",
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Generate available time slots (assuming 1-hour slots from 6 AM to 10 PM)
    const availableSlots = [];
    const startHour = 6; // 6 AM
    const endHour = 22; // 10 PM

    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = new Date(bookingDate);
      slotStart.setHours(hour, 0, 0, 0);

      const slotEnd = new Date(bookingDate);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      // Check if slot is available
      const isAvailable = !bookings.some((booking) => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);

        return (
          (slotStart >= bookingStart && slotStart < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (slotStart <= bookingStart && slotEnd >= bookingEnd)
        );
      });

      if (isAvailable) {
        availableSlots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          formattedTime: `${hour}:00-${hour + 1}:00`,
        });
      }
    }

    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).json({
      message: "Error checking availability",
      error: error.message,
    });
  }
};

/**
 * Create a new booking
 * @route POST /api/bookings
 * @access Private
 */
const createBooking = async (req, res) => {
  try {
    const { turfId, date, startTime, endTime, eventName } = req.body;
    const userId = req.user.id;

    // Validate turfId
    const turf = await prisma.turf.findUnique({
      where: { id: Number(turfId) },
    });

    if (!turf) {
      return res.status(404).json({
        message: "Turf not found",
      });
    }

    // Parse dates
    const bookingDate = new Date(date);
    const bookingStartTime = new Date(startTime);
    const bookingEndTime = new Date(endTime);

    // Check if the slot is available
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        turfId: Number(turfId),
        date: bookingDate,
        status: "CONFIRMED",
        OR: [
          {
            AND: [
              { startTime: { lte: bookingStartTime } },
              { endTime: { gt: bookingStartTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: bookingEndTime } },
              { endTime: { gte: bookingEndTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: bookingStartTime } },
              { endTime: { lte: bookingEndTime } },
            ],
          },
        ],
      },
    });

    if (conflictingBooking) {
      return res.status(400).json({
        message: "This time slot is already booked",
      });
    }

    // Calculate duration in hours
    const durationMs = bookingEndTime - bookingStartTime;
    const durationHours = durationMs / (1000 * 60 * 60);

    // Calculate total cost
    const totalCost = turf.pricePerHour * durationHours;

    // Create booking with PENDING payment status
    const booking = await prisma.booking.create({
      data: {
        userId,
        turfId: Number(turfId),
        date: bookingDate,
        startTime: bookingStartTime,
        endTime: bookingEndTime,
        eventName,
        totalCost,
        status: "CONFIRMED",
        paymentStatus: "PENDING",
      },
      include: {
        turf: true,
      },
    });

    res.status(201).json({
      ...booking,
      message:
        "Booking created successfully. Please complete the payment to confirm your booking.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating booking",
      error: error.message,
    });
  }
};

/**
 * Get all bookings for the logged-in user
 * @route GET /api/bookings
 * @access Private
 */
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        turf: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

/**
 * Cancel a booking
 * @route DELETE /api/bookings/:id
 * @access Private
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find booking
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: {
        turf: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check if booking belongs to user or user is admin
    if (booking.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "You are not authorized to cancel this booking",
      });
    }

    // Check if booking is already cancelled
    if (booking.status === "CANCELLED") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    // Check if booking is in the past
    if (new Date(booking.startTime) < new Date()) {
      return res.status(400).json({
        message: "Cannot cancel past bookings",
      });
    }

    // Check if booking is within 24 hours
    const bookingTime = new Date(booking.startTime);
    const now = new Date();
    const hoursDifference = (bookingTime - now) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      return res.status(400).json({
        message: "Bookings can only be cancelled at least 24 hours in advance",
      });
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: Number(id) },
      data: {
        status: "CANCELLED",
      },
      include: {
        turf: true,
      },
    });

    res.status(200).json({
      ...updatedBooking,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error cancelling booking",
      error: error.message,
    });
  }
};

/**
 * Get all bookings (admin only)
 * @route GET /api/bookings/admin
 * @access Admin only
 */
const getAllBookings = async (req, res) => {
  try {
    const { turfId, date } = req.query;

    // Build filter object
    const filter = {};

    if (turfId) {
      filter.turfId = Number(turfId);
    }

    if (date) {
      const bookingDate = new Date(date);
      bookingDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(bookingDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filter.date = {
        gte: bookingDate,
        lt: nextDay,
      };
    }

    const bookings = await prisma.booking.findMany({
      where: filter,
      include: {
        turf: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

module.exports = {
  checkAvailability,
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
};
