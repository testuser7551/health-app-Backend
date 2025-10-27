import Insurance from "../../models/careTeam/Insurance.js";

// Add new insurance
export const addInsurance = async (req, res) => {
  try {
    const userId = req.user?._id;
    const {
      providerName,
      coverageType,
      policyNumber,
      groupNumber,
      memberId,
      phoneNumber,
      effectiveDate,
      expirationDate,
      notes,
    } = req.body;

    if (!userId || !providerName) {
      return res.status(400).json({ message: "userId and providerName are required" });
    }

    const newInsurance = new Insurance({
      userId,
      providerName,
      coverageType,
      policyNumber,
      groupNumber,
      memberId,
      phoneNumber,
      effectiveDate,
      expirationDate,
      notes,
    });

    await newInsurance.save();

    res.status(201).json({ message: "Insurance added successfully", data: newInsurance });
  } catch (err) {
    console.error("Add Insurance Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all insurances for a user
export const getInsurances = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const insurances = await Insurance.find({ userId });
    res.status(200).json({ message: "Insurances fetched successfully", count: insurances.length, data: insurances });
  } catch (err) {
    console.error("Get Insurances Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update insurance
export const updateInsurance = async (req, res) => {
  try {
    const { insuranceId } = req.params;
    const updates = req.body;

    const insurance = await Insurance.findById(insuranceId);
    if (!insurance) return res.status(404).json({ message: "Insurance not found" });

    Object.assign(insurance, updates);
    await insurance.save();

    res.status(200).json({ message: "Insurance updated successfully", data: insurance });
  } catch (err) {
    console.error("Update Insurance Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete insurance
export const deleteInsurance = async (req, res) => {
  try {
    const { insuranceId } = req.params;

    const insurance = await Insurance.findByIdAndDelete(insuranceId);
    if (!insurance) return res.status(404).json({ message: "Insurance not found" });

    res.status(200).json({ message: "Insurance deleted successfully", data: insurance });
  } catch (err) {
    console.error("Delete Insurance Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
