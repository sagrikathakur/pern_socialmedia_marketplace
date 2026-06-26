import prisma from '../configs/prisma.js';
import { clerkClient } from '@clerk/express';
import fs from 'fs';
import imagekit from '../configs/imageKit.js';
// Helper to fetch/create a user in our local database if they do not exist
const getOrCreateUser = async (userId) => {
  let user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses?.[0]?.emailAddress || '';
      const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';
      const image = clerkUser.imageUrl || '';

      user = await prisma.user.create({
        data: {
          id: userId,
          email,
          name,
          image
        }
      });
    } catch (error) {
      console.error("Failed to sync user from Clerk:", error);
      // Fallback: create a placeholder user in the database
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@clerk.placeholder`,
          name: `User ${userId.substring(0, 8)}`,
          image: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200`
        }
      });
    }
  }
  return user;
};

// Create a new listing
export const createListing = async (req, res) => {
  try {
    const ownerId = req.auth.userId;
    const {
      title,
      platform,
      username,
      followers_count,
      engagement_rate,
      monthly_views,
      niche,
      price,
      description,
      verified,
      monetized,
      country,
      age_range,
      images
    } = req.body;

    // Validation
    if (!title || !platform || !niche || price === undefined || followers_count === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, platform, niche, price, and followers_count are required."
      });
    }

    // Validate platform enum
    const validPlatforms = [
      'youtube', 'instagram', 'tiktok', 'facebook', 'twitter',
      'linkedin', 'pinterest', 'snapchat', 'twitch', 'discord'
    ];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}`
      });
    }

    // Validate niche enum
    const validNiches = [
      'lifestyle', 'fitness', 'food', 'travel', 'tech', 'gaming', 'fashion',
      'beauty', 'business', 'education', 'entertainment', 'music', 'art',
      'sports', 'health', 'finance', 'other'
    ];
    if (!validNiches.includes(niche.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid niche. Must be one of: ${validNiches.join(', ')}`
      });
    }

    // Ensure owner exists in local database
    await getOrCreateUser(ownerId);

    // Upload files to ImageKit if provided
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const response = await imagekit.files.upload({
            file: fs.createReadStream(file.path),
            fileName: file.originalname,
          });
          imageUrls.push(response.url);
          fs.unlinkSync(file.path);
        } catch (uploadError) {
          console.error("ImageKit upload error:", uploadError);
          try {
            fs.unlinkSync(file.path);
          } catch (cleanupError) {
            console.error("Failed to delete local file:", cleanupError);
          }
          return res.status(500).json({
            success: false,
            message: `Failed to upload image(s) to ImageKit: ${uploadError.message}`
          });
        }
      }
    } else if (images) {
      try {
        imageUrls = Array.isArray(images) ? images : JSON.parse(images);
      } catch {
        imageUrls = [images];
      }
    }

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        ownerId,
        title,
        platform: platform.toLowerCase(),
        username: username || null,
        followers_count: parseFloat(followers_count),
        engagement_rate: engagement_rate ? parseFloat(engagement_rate) : null,
        monthly_views: monthly_views ? parseFloat(monthly_views) : null,
        niche: niche.toLowerCase(),
        price: parseFloat(price),
        description: description || null,
        verified: verified === true || verified === 'true',
        monetized: monetized === true || monetized === 'true',
        country: country || null,
        age_range: age_range || '18-24',
        images: imageUrls,
      }
    });

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing
    });
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all listings (public access with filters & search)
export const getListings = async (req, res) => {
  try {
    const {
      platform,
      niche,
      verified,
      monetized,
      minPrice,
      maxPrice,
      minFollowers,
      search
    } = req.query;

    const where = {
      status: 'active'
    };

    // Filter by platform (can be array or comma-separated string or single value)
    if (platform) {
      const platforms = Array.isArray(platform)
        ? platform
        : platform.split(',').map(p => p.trim().toLowerCase());
      where.platform = { in: platforms };
    }

    // Filter by niche (can be array or comma-separated string or single value)
    if (niche) {
      const niches = Array.isArray(niche)
        ? niche
        : niche.split(',').map(n => n.trim().toLowerCase());
      where.niche = { in: niches };
    }

    // Filter by verified
    if (verified !== undefined) {
      where.verified = verified === 'true' || verified === true;
    }

    // Filter by monetized
    if (monetized !== undefined) {
      where.monetized = monetized === 'true' || monetized === true;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Filter by min followers
    if (minFollowers) {
      where.followers_count = { gte: parseFloat(minFollowers) };
    }

    // Filter by search query (contains in title, username, description)
    if (search) {
      const searchLower = search.toLowerCase();
      where.OR = [
        { title: { contains: searchLower, mode: 'insensitive' } },
        { username: { contains: searchLower, mode: 'insensitive' } },
        { description: { contains: searchLower, mode: 'insensitive' } }
      ];
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      listings
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single listing by ID
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true
          }
        }
      }
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    res.status(200).json({
      success: true,
      listing
    });
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update listing (Owner only)
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;

    const listing = await prisma.listing.findUnique({
      where: { id }
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    // Authorization check
    if (listing.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to update this listing."
      });
    }

    const {
      title,
      platform,
      username,
      followers_count,
      engagement_rate,
      monthly_views,
      niche,
      price,
      description,
      verified,
      monetized,
      country,
      age_range,
      images,
      status
    } = req.body;

    // Upload files to ImageKit if provided
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const response = await imagekit.files.upload({
            file: fs.createReadStream(file.path),
            fileName: file.originalname,
          });
          imageUrls.push(response.url);
          fs.unlinkSync(file.path);
        } catch (uploadError) {
          console.error("ImageKit upload error:", uploadError);
          try {
            fs.unlinkSync(file.path);
          } catch (cleanupError) {
            console.error("Failed to delete local file:", cleanupError);
          }
          return res.status(500).json({
            success: false,
            message: `Failed to upload image(s) to ImageKit: ${uploadError.message}`
          });
        }
      }
    } else if (images) {
      try {
        imageUrls = Array.isArray(images) ? images : JSON.parse(images);
      } catch {
        imageUrls = [images];
      }
    }

    const data = {};
    if (title !== undefined) data.title = title;
    if (platform !== undefined) data.platform = platform.toLowerCase();
    if (username !== undefined) data.username = username;
    if (followers_count !== undefined) data.followers_count = parseFloat(followers_count);
    if (engagement_rate !== undefined) data.engagement_rate = engagement_rate ? parseFloat(engagement_rate) : null;
    if (monthly_views !== undefined) data.monthly_views = monthly_views ? parseFloat(monthly_views) : null;
    if (niche !== undefined) data.niche = niche.toLowerCase();
    if (price !== undefined) data.price = parseFloat(price);
    if (description !== undefined) data.description = description;
    if (verified !== undefined) data.verified = verified === true || verified === 'true';
    if (monetized !== undefined) data.monetized = monetized === true || monetized === 'true';
    if (country !== undefined) data.country = country;
    if (age_range !== undefined) data.age_range = age_range;
    
    // Update images if files were uploaded or images parameter was sent
    if (req.files && req.files.length > 0) {
      data.images = imageUrls;
    } else if (images !== undefined) {
      data.images = imageUrls;
    }
    
    if (status !== undefined) {
      const allowedStatuses = ['active', 'ban', 'sold', 'deleted', 'inactive'];
      if (allowedStatuses.includes(status)) {
        data.status = status;
      }
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing: updatedListing
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft delete listing (Owner only)
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;

    const listing = await prisma.listing.findUnique({
      where: { id }
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    // Authorization check
    if (listing.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to delete this listing."
      });
    }

    // Perform soft-delete by setting status to 'deleted'
    const deletedListing = await prisma.listing.update({
      where: { id },
      data: { status: 'deleted' }
    });

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
      listing: deletedListing
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user's listings and balance
export const getUserListings = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Retrieve/sync user to get balance info
    const user = await getOrCreateUser(userId);

    const listings = await prisma.listing.findMany({
      where: {
        ownerId: userId,
        status: { not: 'deleted' } // Exclude soft-deleted listings
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      listings,
      balance: {
        earned: user.earned || 0,
        withdrawn: user.withdrawn || 0,
        available: (user.earned || 0) - (user.withdrawn || 0)
      }
    });
  } catch (error) {
    console.error("Error fetching user listings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update listing status (Admin or owner context)
export const updateListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['active', 'ban', 'sold', 'deleted', 'inactive'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const listing = await prisma.listing.findUnique({
      where: { id }
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({
      success: true,
      message: "Listing status updated successfully",
      listing: updatedListing
    });
  } catch (error) {
    console.error("Error updating listing status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update credential flags (Verification workflow)
export const updateCredentials = async (req, res) => {
  try {
    const { id } = req.params;
    const { isCredentialSubmitted, isCredentialVerified, isCredentialChanged } = req.body;

    const data = {};
    if (isCredentialSubmitted !== undefined) data.isCredentialSubmitted = isCredentialSubmitted === true || isCredentialSubmitted === 'true';
    if (isCredentialVerified !== undefined) data.isCredentialVerified = isCredentialVerified === true || isCredentialVerified === 'true';
    if (isCredentialChanged !== undefined) data.isCredentialChanged = isCredentialChanged === true || isCredentialChanged === 'true';

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No credential fields provided to update."
      });
    }

    const listing = await prisma.listing.findUnique({
      where: { id }
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data
    });

    res.status(200).json({
      success: true,
      message: "Listing credentials updated successfully",
      listing: updatedListing
    });
  } catch (error) {
    console.error("Error updating listing credentials:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
