import HealthRecord from "../../models/6normals/6NormalsModal.js";

/* ---------------------- ADD NEW READING ---------------------- */
export const addHealthRecord = async (req, res) => {
  try {
    const userId = req.userId;
    const { type, ...data } = req.body;
    console.log(userId, type , data );
    const fieldMap = {
      BloodPressure: "bloodPressure",
      LdlCholesterol: "ldlCholesterol",
      FastingBloodGlucose: "fastingBloodGlucose",
      HealthyWeight: "healthyWeight",
      StressManagement: "stressManagement",
      TobaccoFree: "tobaccoFree",
    };

    const fieldName = fieldMap[type];
    if (!fieldName) {
      return res.status(400).json({ message: "Invalid health record type." });
    }

    // Push new record to the right field (create if not exists)
    const updatedRecord = await HealthRecord.findOneAndUpdate(
      { userId },
      { $push: { [fieldName]: data } },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: `${type} record added successfully.`,
      record: updatedRecord,
    });
  } catch (error) {
    console.error("Error adding health record:", error);
    return res.status(500).json({ error: error.message });
  }
};

/* ---------------------- UPDATE READING ---------------------- */
export const updateHealthRecord = async (req, res) => {
  try {
    const { userId, type, recordId, ...updateData } = req.body;

    const fieldMap = {
      BloodPressure: "bloodPressure",
      LdlCholesterol: "ldlCholesterol",
      FastingBloodGlucose: "fastingBloodGlucose",
      HealthyWeight: "healthyWeight",
      StressManagement: "stressManagement",
      TobaccoFree: "tobaccoFree",
    };

    const fieldName = fieldMap[type];
    if (!fieldName) {
      return res.status(400).json({ message: "Invalid health record type." });
    }

    // Update specific reading inside the array
    const updatedRecord = await HealthRecord.findOneAndUpdate(
      { userId, [`${fieldName}._id`]: recordId },
      { $set: { [`${fieldName}.$`]: { _id: recordId, ...updateData } } },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found." });
    }

    return res.status(200).json({
      message: `${type} record updated successfully.`,
      record: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating health record:", error);
    return res.status(500).json({ error: error.message });
  }
};

/* ---------------------- GET ALL READINGS ---------------------- */
export const getAllHealthRecords = async (req, res) => {
  try {
    const { userId } = req.params;

    const record = await HealthRecord.findOne({ userId });

    if (!record) {
      return res.status(404).json({ message: "No health records found." });
    }

    return res.status(200).json({
      message: "All health records fetched successfully.",
      data: record,
    });
  } catch (error) {
    console.error("Error fetching health records:", error);
    return res.status(500).json({ error: error.message });
  }
};


/* ---------------------- GET LATEST RECORDS ---------------------- */
export const getLatestHealthRecords = async (req, res) => {
  try {
    const { userId } = req.params;

    const record = await HealthRecord.findOne({ userId });

    if (!record) {
      return res.status(404).json({ message: "No health records found." });
    }

    // Helper function to get latest entry safely
    const getLatest = (arr) =>
      arr && arr.length > 0
        ? arr.sort((a, b) => new Date(b.measurementTime) - new Date(a.measurementTime))[0]
        : null;

    // Extract latest data for each normal type
    const latestData = {
      bloodPressure: getLatest(record.bloodPressure),
      ldlCholesterol: getLatest(record.ldlCholesterol),
      fastingBloodGlucose: getLatest(record.fastingBloodGlucose),
      healthyWeight: getLatest(record.healthyWeight),
      stressManagement: getLatest(record.stressManagement),
      tobaccoFree: getLatest(record.tobaccoFree),
    };

    return res.status(200).json({
      message: "Latest health records fetched successfully.",
      data: latestData,
    });
  } catch (error) {
    console.error("Error fetching latest health records:", error);
    return res.status(500).json({ error: error.message });
  }
};
