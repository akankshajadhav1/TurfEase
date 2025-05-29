const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Add a new turf
 * @route POST /api/turfs
 * @access Admin only
 */
const addTurf = async (req, res) => {
  try {
    const { name, location, description, type, pricePerHour, imageUrl } =
      req.body;

    const turf = await prisma.turf.create({
      data: {
        name,
        location,
        description,
        type,
        pricePerHour,
        imageUrl,
      },
    });

    res.status(201).json(turf);
  } catch (error) {
    res.status(500).json({
      message: "Error creating turf",
      error: error.message,
    });
  }
};

/**
 * Update a turf
 * @route PUT /api/turfs/:id
 * @access Admin only
 */
const updateTurf = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, description, type, pricePerHour, imageUrl } =
      req.body;

    // Check if turf exists
    const existingTurf = await prisma.turf.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTurf) {
      return res.status(404).json({
        message: "Turf not found",
      });
    }

    // Update turf
    const updatedTurf = await prisma.turf.update({
      where: { id: Number(id) },
      data: {
        name: name || undefined,
        location: location || undefined,
        description: description || undefined,
        type: type || undefined,
        pricePerHour: pricePerHour !== undefined ? pricePerHour : undefined,
        imageUrl: imageUrl || undefined,
      },
    });

    res.status(200).json(updatedTurf);
  } catch (error) {
    res.status(500).json({
      message: "Error updating turf",
      error: error.message,
    });
  }
};

/**
 * Delete a turf
 * @route DELETE /api/turfs/:id
 * @access Admin only
 */
const deleteTurf = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if turf exists
    const existingTurf = await prisma.turf.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTurf) {
      return res.status(404).json({
        message: "Turf not found",
      });
    }

    // Check if turf has bookings
    const bookings = await prisma.booking.findMany({
      where: {
        turfId: Number(id),
        status: "CONFIRMED",
      },
    });

    if (bookings.length > 0) {
      return res.status(400).json({
        message: "Cannot delete turf with active bookings",
      });
    }

    // Delete turf
    await prisma.turf.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: "Turf deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting turf",
      error: error.message,
    });
  }
};

/**
 * Get all turfs with optional filtering
 * @route GET /api/turfs
 * @access Public
 */
const getAllTurfs = async (req, res) => {
  try {
    const { location, type, available } = req.query;

    // Build filter object
    const filter = {};

    if (location) {
      filter.location = {
        contains: location,
      };
    }

    if (type) {
      filter.type = type;
    }

    // Get all turfs with filters
    const turfs = await prisma.turf.findMany({
      where: filter,
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json(turfs);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching turfs",
      error: error.message,
    });
  }
};

/**
 * Search turfs by keyword
 * @route GET /api/turfs/search
 * @access Public
 */
const searchTurfs = async (req, res) => {
  try {
    const { keyword, location, type } = req.query;

    // Build filter object
    const filter = {};

    if (keyword) {
      filter.OR = [
        {
          name: {
            contains: keyword,
          },
        },
        {
          description: {
            contains: keyword,
          },
        },
      ];
    }

    if (location) {
      filter.location = {
        contains: location,
      };
    }

    if (type) {
      filter.type = type;
    }

    // Search turfs
    const turfs = await prisma.turf.findMany({
      where: filter,
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json(turfs);
  } catch (error) {
    res.status(500).json({
      message: "Error searching turfs",
      error: error.message,
    });
  }
};

/**
 * Get a single turf by ID
 * @route GET /api/turfs/:id
 * @access Public
 */
const getTurfById = async (req, res) => {
  try {
    const { id } = req.params;

    const turf = await prisma.turf.findUnique({
      where: { id: Number(id) },
    });

    if (!turf) {
      return res.status(404).json({
        message: "Turf not found",
      });
    }

    res.status(200).json(turf);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching turf",
      error: error.message,
    });
  }
};

module.exports = {
  addTurf,
  updateTurf,
  deleteTurf,
  getAllTurfs,
  searchTurfs,
  getTurfById,
};
