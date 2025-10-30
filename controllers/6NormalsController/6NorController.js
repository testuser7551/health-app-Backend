import HealthRecord from "../../models/6normals/6NormalsModal.js";

// /* ---------------------- ADD NEW READING ---------------------- */
// export const addHealthRecord = async (req, res) => {
//   try {
//     const { userId, type, ...data } = req.body;
//     console.log(userId, type , data );
//     const fieldMap = {
//       BloodPressure: "bloodPressure",
//       LdlCholesterol: "ldlCholesterol",
//       FastingBloodGlucose: "fastingBloodGlucose",
//       HealthyWeight: "healthyWeight",
//       StressManagement: "stressManagement",
//       TobaccoFree: "tobaccoFree",
//     };

//     const fieldName = fieldMap[type];
//     if (!fieldName) {
//       return res.status(400).json({ message: "Invalid health record type." });
//     }

//     // Push new record to the right field (create if not exists)
//     const updatedRecord = await HealthRecord.findOneAndUpdate(
//       { userId },
//       { $push: { [fieldName]: data } },
//       { upsert: true, new: true }
//     );

//     return res.status(200).json({
//       message: `${type} record added successfully.`,
//       record: updatedRecord,
//     });
//   } catch (error) {
//     console.error("Error adding health record:", error);
//     return res.status(500).json({ error: error.message });
//   }
// };


/* ---------------------- ADD NEW READING ---------------------- */
export const addHealthRecord = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const {  type, ...data } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ message: "Missing required fields: userId or type." });
    }

    console.log("Incoming Record:", { userId, type, data });

    // Field mapping for MongoDB
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

    /* ---------------------- VALIDATION BY TYPE ---------------------- */
    let isValid = true;
    let validationError = "";

    switch (type) {
      case "BloodPressure": {
        const { systolic, diastolic, pulse, measurementTime } = data;
        if (
          systolic == null ||
          diastolic == null ||
          isNaN(systolic) ||
          isNaN(diastolic)
        ) {
          isValid = false;
          validationError = "Systolic and Diastolic values are required and must be numbers.";
        } else if (systolic < 50 || systolic > 250 || diastolic < 30 || diastolic > 150) {
          isValid = false;
          validationError = "Blood pressure values are out of realistic range.";
        } else if (measurementTime && new Date(measurementTime) > new Date()) {
          isValid = false;
          validationError = "Measurement time cannot be in the future.";
        } else if (pulse && (isNaN(pulse) || pulse < 30 || pulse > 200)) {
          isValid = false;
          validationError = "Pulse must be a valid number between 30 and 200 if provided.";
        }
        break;
      }

      case "LdlCholesterol": {
        const { ldl, measurementTime } = data;
        if (ldl == null || isNaN(ldl)) {
          isValid = false;
          validationError = "LDL cholesterol value is required and must be numeric.";
        } else if (ldl < 30 || ldl > 400) {
          isValid = false;
          validationError = "LDL cholesterol must be between 30 and 400 mg/dL.";
        } else if (measurementTime && new Date(measurementTime) > new Date()) {
          isValid = false;
          validationError = "Measurement time cannot be in the future.";
        }
        break;
      }

      case "FastingBloodGlucose": {
        const { bloodGlucose, measurementTime } = data;
        if (bloodGlucose == null || isNaN(bloodGlucose)) {
          isValid = false;
          validationError = "bloodGlucose value is required and must be numeric.";
        } else if (bloodGlucose < 40 || bloodGlucose > 400) {
          isValid = false;
          validationError = "BloodGlucose value must be between 40 and 400 mg/dL.";
        } else if (measurementTime && new Date(measurementTime) > new Date()) {
          isValid = false;
          validationError = "Measurement time cannot be in the future.";
        }
        break;
      }

      case "HealthyWeight": {
        const { weight, heightFeet, heightInches, waist, measurementTime } = data;
        if (weight == null || isNaN(weight)) {
          isValid = false;
          validationError = "Weight is required and must be numeric.";
        } else if (weight < 50 || weight > 700) {
          isValid = false;
          validationError = "Weight must be between 50 and 700 lbs.";
        } else if (
          (heightFeet == null && heightInches == null) ||
          isNaN(heightFeet) ||
          isNaN(heightInches)
        ) {
          isValid = false;
          validationError = "Height (feet and inches) must be valid numbers.";
        } else if (waist && (isNaN(waist) || waist < 10 || waist > 100)) {
          isValid = false;
          validationError = "Waist must be between 10 and 100 inches.";
        } else if (measurementTime && new Date(measurementTime) > new Date()) {
          isValid = false;
          validationError = "Measurement time cannot be in the future.";
        }
        break;
      }

      case "StressManagement": {
        const { stressLevel, notes, measurementTime } = data;
        if (stressLevel == null || isNaN(stressLevel)) {
          isValid = false;
          validationError = "Stress level is required and must be numeric.";
        } else if (stressLevel < 0 || stressLevel > 10) {
          isValid = false;
          validationError = "Stress level must be between 0 and 10.";
        } else if (measurementTime && new Date(measurementTime) > new Date()) {
          isValid = false;
          validationError = "Measurement time cannot be in the future.";
        } else if (notes && notes.trim().length < 3) {
          isValid = false;
          validationError = "Notes must be at least 3 characters if provided.";
        }
        break;
      }

      case "TobaccoFree": {
        const { tobaccoStatus, notes, measurementTime } = data;
        const validStatuses = ["Non-Smoker", "Former", "Current"];
        if (!tobaccoStatus || !validStatuses.includes(tobaccoStatus)) {
          isValid = false;
          validationError = "Tobacco status must be one of: Non-Smoker, Former, Current.";
        } else if (measurementTime && new Date(measurementTime) > new Date()) {
          isValid = false;
          validationError = "Measurement time cannot be in the future.";
        } else if (notes && notes.trim().length < 3) {
          isValid = false;
          validationError = "Notes must be at least 3 characters if provided.";
        }
        break;
      }

      default:
        isValid = false;
        validationError = "Invalid health record type.";
        break;
    }

    /* ---------------------- VALIDATION RESULT ---------------------- */
    if (!isValid) {
      return res.status(400).json({ message: validationError });
    }

    /* ---------------------- STORE RECORD ---------------------- */
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
