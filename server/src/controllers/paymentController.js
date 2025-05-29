const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Create a payment intent for a booking
 * @route POST /api/payments/create-intent
 * @access Private
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      include: {
        turf: true,
        user: true, // Include user details for the description
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Verify booking belongs to user
    if (booking.userId !== userId) {
      return res.status(403).json({
        message: "Not authorized to pay for this booking",
      });
    }

    // Check if booking is already paid
    if (booking.paymentStatus === "PAID") {
      return res.status(400).json({
        message: "Booking is already paid",
      });
    }

    const amount = Math.round(booking.totalCost * 100); // Convert to paisa

    // Create a detailed description for the payment
    const description = `Turf Booking - ${booking.turf.name} on ${new Date(
      booking.date
    ).toLocaleDateString()} from ${booking.startTime} to ${
      booking.endTime
    } for ${booking.user.name}`;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "inr",
      description: description, // Add description as required by Indian regulations
      metadata: {
        bookingId: booking.id.toString(),
        userId: userId.toString(),
        turfId: booking.turfId.toString(),
        turfName: booking.turf.name,
        bookingDate: booking.date.toISOString(),
        startTime: booking.startTime,
        endTime: booking.endTime,
      },
      automatic_payment_methods: {
        enabled: true,
      },
      statement_descriptor_suffix: "TURF BOOKING", // Add a statement descriptor
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      booking: {
        id: booking.id,
        totalCost: booking.totalCost,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        turf: {
          name: booking.turf.name,
        },
      },
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    res.status(500).json({
      message: "Error creating payment intent",
      error: error.message,
    });
  }
};

/**
 * Confirm payment for a booking
 * @route POST /api/payments/confirm
 * @access Private
 */
const confirmPayment = async (req, res) => {
  try {
    const { bookingId, paymentIntentId } = req.body;
    const userId = req.user.id;

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Verify booking belongs to user
    if (booking.userId !== userId) {
      return res.status(403).json({
        message: "Not authorized to confirm payment for this booking",
      });
    }

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        message: "Payment has not been completed",
      });
    }

    // Update booking payment status
    const updatedBooking = await prisma.booking.update({
      where: { id: Number(bookingId) },
      data: {
        paymentStatus: "PAID",
        paymentId: paymentIntentId,
      },
      include: {
        turf: true,
      },
    });

    res.status(200).json({
      ...updatedBooking,
      message: "Payment confirmed successfully",
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({
      message: "Error confirming payment",
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
};
