import HealthcareProvider from "../../models/careTeam/HealthcareProvider.js";
import UserCareTeamTrack from "../../models/careTeam/UserCareTeamTrack.js";

export const searchProviders = async (req, res) => {
    try {
        const { searchQuery, state, city } = req.body;

        // Build dynamic search filters
        const filters = {};

        if (searchQuery) {
            // Check if the searchQuery looks like a number (for NPI search)
            const isNumeric = /^\d+$/.test(searchQuery.trim());

            if (isNumeric) {
                // Match exact or partial numeric NPI numbers
                filters.$or = [
                    { npi_number: { $regex: searchQuery.trim(), $options: "i" } },
                ];
            } else {
                // Match text-based fields (name, specialty, organization)
                filters.$or = [
                    { name: { $regex: searchQuery, $options: "i" } },
                    { specialty: { $regex: searchQuery, $options: "i" } },
                    { organization: { $regex: searchQuery, $options: "i" } },
                ];
            }
        }
        // Allow partial matches but require at least 3 characters


        if (state) filters.state = state.toUpperCase();
        if (city) filters.city = new RegExp(city, "i");

        const results = await HealthcareProvider.find(filters);

        if (!results.length) {
            return res.status(404).json({
                message: "No providers found for your search criteria",
                data: [],
            });
        }

        res.status(200).json({
            message: "Providers found successfully",
            count: results.length,
            data: results,
        });
    } catch (err) {
        console.error("Search Providers Error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const addProviderToCareTeam = async (req, res) => {
    try {
        const userId = req.user?._id; // get from auth middleware or body
        const { providerIds } = req.body; // array of provider IDs

        if (!userId || !Array.isArray(providerIds) || providerIds.length === 0) {
            return res.status(400).json({
                message: "userId and providerIds (array) are required",
            });
        }

        // Validate each providerId exists in DB
        const validProviders = await HealthcareProvider.find({
            _id: { $in: providerIds },
        });

        if (validProviders.length !== providerIds.length) {
            return res.status(404).json({
                message: "One or more provider IDs are invalid",
            });
        }

        // Check if user already has a record
        let userTrack = await UserCareTeamTrack.findOne({ userId });

        if (userTrack) {
            // Merge new providers without duplicates
            const mergedProviders = Array.from(
                new Set([...userTrack.providerId.map(id => id.toString()), ...providerIds])
            );

            userTrack.providerId = mergedProviders;
            await userTrack.save();

            return res.status(200).json({
                status : 'success',
                message: "Providers added to existing care team successfully",
                data: userTrack,
            });
        } else {
            // Create new record
            const newTrack = new UserCareTeamTrack({
                userId,
                providerId: providerIds,
            });

            await newTrack.save();

            return res.status(201).json({
                status : 'success',
                message: "New care team created and providers added successfully",
                data: newTrack,
            });
        }
    } catch (err) {
        console.error("Add Provider Error:", err.message);
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};

export const removeProviderFromCareTeam = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { providerId } = req.body; // single provider ID to remove

        if (!userId || !providerId) {
            return res.status(400).json({
                message: "userId and providerId are required",
            });
        }

        // Find user's care team
        const userTrack = await UserCareTeamTrack.findOne({ userId });

        if (!userTrack) {
            return res.status(404).json({
                message: "User care team not found",
            });
        }

        // Check if provider exists in array
        if (!userTrack.providerId.includes(providerId)) {
            return res.status(404).json({
                message: "Provider not found in user's care team",
            });
        }

        // Remove the provider
        userTrack.providerId = userTrack.providerId.filter(
            (id) => id.toString() !== providerId
        );

        await userTrack.save();

        res.status(200).json({
            message: "Provider removed from care team successfully",
            data: userTrack,
        });
    } catch (err) {
        console.error("Remove Provider Error:", err.message);
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};

export const getUserCareTeamProviders = async (req, res) => {
    try {
        const userId = req.user?._id || req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        // Find user's care team track
        const userTrack = await UserCareTeamTrack.findOne({ userId });

        if (!userTrack || userTrack.providerId.length === 0) {
            return res.status(404).json({
                message: "No providers found for this user",
                data: [],
            });
        }

        // Populate provider details
        const providers = await HealthcareProvider.find({
            _id: { $in: userTrack.providerId },
        });

        res.status(200).json({
            message: "User care team providers fetched successfully",
            count: providers.length,
            data: providers,
        });
    } catch (err) {
        console.error("Get User Care Team Providers Error:", err.message);
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};