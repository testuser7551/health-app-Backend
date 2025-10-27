// controllers/CareTeamController/caregiverController.js
import Caregiver from "../../models/careTeam/Caregiver.js";

// Add new caregiver
export const addCaregiver = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { name, relationship, phone, email, address, notes } = req.body;

    if (!userId || !name || !relationship) {
      return res.status(400).json({ message: "userId, name, and relationship are required" });
    }

    const newCaregiver = new Caregiver({
      userId,
      name,
      relationship,
      phone,
      email,
      address,
      notes,
    });

    await newCaregiver.save();

    res.status(201).json({ message: "Caregiver added successfully", data: newCaregiver });
  } catch (err) {
    console.error("Add Caregiver Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all caregivers for a user
export const getCaregivers = async (req, res) => {
  try {
    const userId = req.user?._id;

    const caregivers = await Caregiver.find({ userId });
    res.status(200).json({ message: "Caregivers fetched successfully", count: caregivers.length, data: caregivers });
  } catch (err) {
    console.error("Get Caregivers Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update caregiver
export const updateCaregiver = async (req, res) => {
  try {
    const { caregiverId } = req.params;
    const updates = req.body;

    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) return res.status(404).json({ message: "Caregiver not found" });

    Object.assign(caregiver, updates);
    await caregiver.save();

    res.status(200).json({ message: "Caregiver updated successfully", data: caregiver });
  } catch (err) {
    console.error("Update Caregiver Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete caregiver
export const deleteCaregiver = async (req, res) => {
  try {
    const { caregiverId } = req.params;

    const caregiver = await Caregiver.findByIdAndDelete(caregiverId);
    if (!caregiver) return res.status(404).json({ message: "Caregiver not found" });

    res.status(200).json({ message: "Caregiver deleted successfully", data: caregiver });
  } catch (err) {
    console.error("Delete Caregiver Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
