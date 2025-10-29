import BloodPressure from "../../models/6normals/BloodPressure.js";
import BodyTemperature from "../../models/6normals/BodyTemperature.js";
// Change this import statement:
import PulseRate from "../../models/6normals/PulseRate.js";  // Correct the path here!
import RespiratoryRate from "../../models/6normals/RespiratoryRate.js";
import SpO2 from "../../models/6normals/spo2.js";
import StepCount from "../../models/6normals/StepCount.js"; 
import Vaccine from "../../models/6normals/Vaccine.js";
import FullBodyCheckup from "../../models/6normals/FullBodyCheckup.js"; // adjust the path if needed
 
export const addBloodPressureReading = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.userId;
        const {
            quickEntry,
            systolic,
            diastolic,
            pulse,
            arm,
            position,
            measurementTime,
            notes
        } = req.body;

        if (!userId || !systolic || !diastolic) {
            return res.status(400).json({
                message: "userId, systolic, and diastolic values are required"
            });
        }

        // 🔹 Convert measurementTime string to Date object
        let parsedMeasurementTime;
        if (measurementTime) {
            // Handle "DD/MM/YYYY, HH:mm" format
            const [datePart, timePart] = measurementTime.split(', ');
            const [day, month, year] = datePart.split('/');
            const [hours, minutes] = timePart.split(':');

            // Create Date object (months are 0-indexed in JavaScript)
            parsedMeasurementTime = new Date(year, month - 1, day, hours, minutes);
        } else {
            parsedMeasurementTime = new Date(); // Use current time if not provided
        }

        // 🔹 Find existing record for user
        let userBP = await BloodPressure.findOne({ userId });

        const newReading = {
            systolic: parseInt(systolic),
            diastolic: parseInt(diastolic),
            pulse: pulse ? parseInt(pulse) : undefined,
            arm,
            position,
            measurementTime: parsedMeasurementTime,
            notes
        };

        if (userBP) {
            userBP.readings.push(newReading);
            await userBP.save();
            return res.status(200).json({
                status: "success",
                message: "Blood pressure reading added successfully",
                data: userBP
            });
        } else {
            const newRecord = new BloodPressure({
                userId,
                readings: [newReading]
            });
            await newRecord.save();
            return res.status(201).json({
                status: "success",
                message: "New blood pressure record created",
                data: newRecord
            });
        }
    } catch (err) {
        console.error("Add Blood Pressure Error:", err.message);
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

export const getLatestBloodPressure = async (req, res) => {
    try {
        const userId = req.user?._id || req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const userBP = await BloodPressure.findOne({ userId });

        if (!userBP || userBP.readings.length === 0) {
            return res.status(404).json({
                message: "No blood pressure readings found for this user",
                data: null
            });
        }

        // 🕒 Get last added reading (most recent)
        const latestReading = userBP.readings[userBP.readings.length - 1];

        // 🔹 Format the date for frontend display
        const formattedReading = {
            ...latestReading.toObject(),
            measurementTime: latestReading.measurementTime.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        };

        res.status(200).json({
            message: "Latest blood pressure reading fetched successfully",
            data: formattedReading
        });
    } catch (err) {
        console.error("Get Latest Blood Pressure Error:", err.message);
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

export const addBodyTemperatureReading = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.userId;
        const { temperature, unit, measurementTime, notes } = req.body;

        if (!userId || !temperature) {
            return res
                .status(400)
                .json({ message: "userId and temperature are required" });
        }

        // 🕒 Convert measurementTime to Date
        let parsedMeasurementTime;
        if (measurementTime.includes("T")) {
            parsedMeasurementTime = new Date(measurementTime); // ISO format
        } else {
            const [datePart, timePart] = measurementTime.split(", ");
            const [day, month, year] = datePart.split("/");
            const [hours, minutes] = timePart.split(":");
            parsedMeasurementTime = new Date(year, month - 1, day, hours, minutes);
        }

        const newReading = {
            temperature: parseFloat(temperature),
            unit: unit || "°F",
            measurementTime: parsedMeasurementTime,
            notes: notes || "",
        };

        // Check existing record for user
        let userTemp = await BodyTemperature.findOne({ userId });

        if (userTemp) {
            userTemp.readings.push(newReading);
            await userTemp.save();
            return res.status(200).json({
                status: "success",
                message: "Body temperature reading added successfully",
                data: userTemp,
            });
        } else {
            const newRecord = new BodyTemperature({
                userId,
                readings: [newReading],
            });
            await newRecord.save();
            return res.status(201).json({
                status: "success",
                message: "New body temperature record created",
                data: newRecord,
            });
        }
    } catch (err) {
        console.error("Add Body Temperature Error:", err.message);
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};

export const getLatestBodyTemperature = async (req, res) => {
    try {
        const userId = req.user?._id || req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const userTemp = await BodyTemperature.findOne({ userId });

        if (!userTemp || userTemp.readings.length === 0) {
            return res
                .status(404)
                .json({ message: "No temperature readings found", data: null });
        }

        const latestReading = userTemp.readings[userTemp.readings.length - 1];

        const formattedReading = {
            ...latestReading.toObject(),
            measurementTime: latestReading.measurementTime.toISOString(),
        };


        res.status(200).json({
            message: "Latest temperature reading fetched successfully",
            data: formattedReading,
        });
    } catch (err) {
        console.error("Get Latest Body Temperature Error:", err.message);
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};


export const addPulseRateReading = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { pulseRate, measurementTime, notes } = req.body;

    if (!userId || !pulseRate) {
      return res.status(400).json({ message: "userId and pulseRate are required" });
    }

    // Parse measurementTime if provided
    let parsedMeasurementTime = measurementTime ? new Date(measurementTime) : new Date();

    const newReading = {
      pulseRate: parseInt(pulseRate),
      measurementTime: parsedMeasurementTime,
      notes: notes || "",
    };

    let userPulse = await PulseRate.findOne({ userId });

    if (userPulse) {
      userPulse.readings.push(newReading);
      await userPulse.save();
      return res.status(200).json({
        status: "success",
        message: "Pulse rate reading added successfully",
        data: userPulse,
      });
    } else {
      const newRecord = new PulseRate({
        userId,
        readings: [newReading],
      });
      await newRecord.save();
      return res.status(201).json({
        status: "success",
        message: "New pulse rate record created",
        data: newRecord,
      });
    }
  } catch (err) {
    console.error("Add Pulse Rate Error:", err.message);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const getLatestPulseRate = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId;  // Get userId from req.user or params

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const userPulse = await PulseRate.findOne({ userId });

    // If no pulse rate record is found
    if (!userPulse || userPulse.readings.length === 0) {
      return res.status(404).json({ message: "No pulse rate readings found", data: null });
    }

    const latestReading = userPulse.readings[userPulse.readings.length - 1]; // Get the latest reading

    res.status(200).json({
      message: "Latest pulse rate reading fetched successfully",
      data: latestReading, // Return the latest pulse rate data
    });
  } catch (err) {
    console.error("Get Latest Pulse Rate Error:", err.message);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};




export const addRespiratoryRateReading = async (req, res) => {
  try {
    // Get userId from request (either from authenticated user or request body)
    const userId = req.user?._id || req.body.userId;
    const { respiratoryRate, measurementTime, notes } = req.body;

    // Validate input
    if (!userId || !respiratoryRate) {
      return res.status(400).json({ message: "userId and respiratoryRate are required" });
    }

    // Validate the range of respiratory rate (5-60 br/min)
    if (respiratoryRate < 5 || respiratoryRate > 60) {
      return res.status(400).json({ message: "Respiratory rate must be between 5 and 60 br/min" });
    }

    // Parse the measurementTime to Date, default to current time if not provided
    let parsedMeasurementTime = measurementTime ? new Date(measurementTime) : new Date();

    // Create a new reading object
    const newReading = {
      respiratoryRate: parseInt(respiratoryRate),
      measurementTime: parsedMeasurementTime,
      notes: notes || "",
    };

    // Find the user's respiratory rate record
    let userRespiratoryRate = await RespiratoryRate.findOne({ userId });

    if (userRespiratoryRate) {
      // If the record exists, add the new reading to the readings array
      userRespiratoryRate.readings.push(newReading);
      await userRespiratoryRate.save();  // Save the updated document
      return res.status(200).json({
        status: "success",
        message: "Respiratory rate reading added successfully",
        data: userRespiratoryRate,
      });
    } else {
      // If no record exists, create a new one
      const newRecord = new RespiratoryRate({
        userId,
        readings: [newReading],
      });
      await newRecord.save();  // Save the new record
      return res.status(201).json({
        status: "success",
        message: "New respiratory rate record created",
        data: newRecord,
      });
    }
  } catch (err) {
    console.error("Add Respiratory Rate Error:", err.message);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};




export const getLatestRespiratoryRate = async (req, res) => {
  try {
    // Get userId from request (either from authenticated user or route params)
    const userId = req.user?._id || req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Find the user's respiratory rate record
    const userRespiratoryRate = await RespiratoryRate.findOne({ userId });

    // If no record is found or no readings exist
    if (!userRespiratoryRate || userRespiratoryRate.readings.length === 0) {
      return res.status(404).json({ message: "No respiratory rate readings found", data: null });
    }

    // Get the latest reading (last element of the readings array)
    const latestReading = userRespiratoryRate.readings[userRespiratoryRate.readings.length - 1];

    res.status(200).json({
      message: "Latest respiratory rate reading fetched successfully",
      data: latestReading,  // Return the latest reading data
    });
  } catch (err) {
    console.error("Get Latest Respiratory Rate Error:", err.message);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const addSpO2Reading = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { spo2Value, pulseRate, measurementTime, notes } = req.body;

    // Validate input data
    if (!userId || !spo2Value || isNaN(spo2Value) || spo2Value < 50 || spo2Value > 100) {
      return res.status(400).json({ message: "Valid SpO₂ value (50-100%) is required" });
    }

    const newReading = {
      spo2Value: parseInt(spo2Value),
      pulseRate: pulseRate ? parseInt(pulseRate) : null,
      measurementTime: measurementTime || new Date().toISOString(),
      notes: notes || "",
    };

    let userSpO2 = await SpO2.findOne({ userId });

    if (userSpO2) {
      // Add the new reading to the existing user's SpO₂ readings
      userSpO2.readings.push(newReading);
      await userSpO2.save();
      return res.status(200).json({
        status: "success",
        message: "SpO₂ reading added successfully",
        data: userSpO2,
      });
    } else {
      // If no existing SpO₂ record for the user, create a new one
      const newSpO2Record = new SpO2({
        userId,
        readings: [newReading],
      });
      await newSpO2Record.save();
      return res.status(201).json({
        status: "success",
        message: "New SpO₂ record created",
        data: newSpO2Record,
      });
    }
  } catch (err) {
    console.error("Add SpO₂ Reading Error:", err.message);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const getLatestSpO2Reading = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId; // Get userId from req.user or params

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const userSpO2 = await SpO2.findOne({ userId });

    // If no SpO₂ record is found
    if (!userSpO2 || userSpO2.readings.length === 0) {
      return res.status(404).json({ message: "No SpO₂ readings found", data: null });
    }

    const latestReading = userSpO2.readings[userSpO2.readings.length - 1]; // Get the latest reading

    res.status(200).json({
      message: "Latest SpO₂ reading fetched successfully",
      data: latestReading, // Return the latest SpO₂ data
    });
  } catch (err) {
    console.error("Get Latest SpO₂ Error:", err.message);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};


export const addStepCount = async (req, res) => {
  try {
    const { stepCount, measurementTime, notes } = req.body;
    const userId = req.user?._id || req.params.userId;
    // Check if all required fields are provided
    if (!stepCount || !userId) {
      return res.status(400).json({ message: "Step count and user ID are required." });
    }

    // Create a new step count record
    const newStepCount = new StepCount({
      userId,
      readings: [{
        stepCount,
        measurementTime,
        notes
      }]
    });

    // Save the record
    await newStepCount.save();

    res.status(201).json({ message: "Step count added successfully.", data: newStepCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add step count.", error: error.message });
  }
};


export const getStepCounts = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId;
    // Find step counts for the specified user
    const stepCounts = await StepCount.find({ userId });

    if (!stepCounts.length) {
      return res.status(404).json({ message: "No step counts found for this user." });
    }

    res.status(200).json({ message: "Step counts retrieved successfully.", data: stepCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve step counts.", error: error.message });
  }
};





export const getLatestHealthData = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Fetch the latest blood pressure reading
    const userBP = await BloodPressure.findOne({ userId });
    const latestBP = userBP && userBP.readings.length > 0
      ? userBP.readings[userBP.readings.length - 1]
      : null;

    // Fetch the latest body temperature reading
    const userTemp = await BodyTemperature.findOne({ userId });
    const latestTemp = userTemp && userTemp.readings.length > 0
      ? userTemp.readings[userTemp.readings.length - 1]
      : null;

    // Fetch the latest pulse rate reading
    const userPulse = await PulseRate.findOne({ userId });
    const latestPulse = userPulse && userPulse.readings.length > 0
      ? userPulse.readings[userPulse.readings.length - 1]
      : null;

    // Fetch the latest respiratory rate reading
    const userRespiratoryRate = await RespiratoryRate.findOne({ userId });
    const latestRespiratoryRate = userRespiratoryRate && userRespiratoryRate.readings.length > 0
      ? userRespiratoryRate.readings[userRespiratoryRate.readings.length - 1]
      : null;

    // Fetch step counts
    const stepCounts = await StepCount.find({ userId });
    
    // Fetch the latest SpO2 reading
    const userSpO2 = await SpO2.findOne({ userId });
    const latestSpO2 = userSpO2 && userSpO2.readings.length > 0
      ? userSpO2.readings[userSpO2.readings.length - 1]
      : null;

    // Prepare response data
    const responseData = {
      bloodPressure: latestBP ? {
        ...latestBP.toObject(),
        measurementTime: latestBP.measurementTime.toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      } : null,
      
      bodyTemperature: latestTemp ? {
        ...latestTemp.toObject(),
        measurementTime: latestTemp.measurementTime.toISOString()
      } : null,

      pulseRate: latestPulse || null,
      
      respiratoryRate: latestRespiratoryRate || null,

      stepCounts: stepCounts.length > 0 ? stepCounts : null,

      spO2: latestSpO2 || null
    };

    res.status(200).json({
      message: "Latest health data fetched successfully",
      data: responseData
    });

  } catch (err) {
    console.error("Get Latest Health Data Error:", err.message);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};



export const addVaccineReading = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { vaccineStatus, lastCheckDate, measurementTime, notes } = req.body;

    if (!userId || !vaccineStatus) {
      return res
        .status(400)
        .json({ message: "userId and vaccineStatus are required" });
    }

    // 🕒 Convert measurementTime to Date
    let parsedMeasurementTime;
    if (measurementTime?.includes("T")) {
      parsedMeasurementTime = new Date(measurementTime); // ISO format
    } else if (measurementTime) {
      const [datePart, timePart] = measurementTime.split(", ");
      const [day, month, year] = datePart.split("/");
      const [hours, minutes] = timePart.split(":");
      parsedMeasurementTime = new Date(year, month - 1, day, hours, minutes);
    } else {
      parsedMeasurementTime = new Date();
    }

    const newReading = {
      vaccineStatus,
      lastCheckDate: lastCheckDate || "",
      measurementTime: parsedMeasurementTime,
      notes: notes || "",
    };

    // 🔍 Check if user already has vaccine record
    let userVaccine = await Vaccine.findOne({ userId });

    if (userVaccine) {
      userVaccine.readings.push(newReading);
      await userVaccine.save();
      return res.status(200).json({
        status: "success",
        message: "Vaccine record added successfully",
        data: userVaccine,
      });
    } else {
      const newRecord = new Vaccine({
        userId,
        readings: [newReading],
      });
      await newRecord.save();
      return res.status(201).json({
        status: "success",
        message: "New vaccine record created",
        data: newRecord,
      });
    }
  } catch (err) {
    console.error("Add Vaccine Error:", err.message);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ Get latest vaccine reading
export const getLatestVaccineReading = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const userVaccine = await Vaccine.findOne({ userId });

    if (!userVaccine || userVaccine.readings.length === 0) {
      return res
        .status(404)
        .json({ message: "No vaccine readings found", data: null });
    }

    const latestReading = userVaccine.readings[userVaccine.readings.length - 1];

    const formattedReading = {
      ...latestReading.toObject(),
      measurementTime: latestReading.measurementTime.toISOString(),
    };

    res.status(200).json({
      message: "Latest vaccine record fetched successfully",
      data: formattedReading,
    });
  } catch (err) {
    console.error("Get Latest Vaccine Error:", err.message);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const addFullBodyCheckupReading = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { lastCheckupDate, measurementTime, notes } = req.body;

    if (!userId || !lastCheckupDate) {
      return res
        .status(400)
        .json({ message: "userId and lastCheckupDate are required" });
    }

    // 🕒 Convert measurementTime to Date
    let parsedMeasurementTime;
    if (measurementTime?.includes("T")) {
      parsedMeasurementTime = new Date(measurementTime); // ISO format
    } else if (measurementTime) {
      const [datePart, timePart] = measurementTime.split(", ");
      const [day, month, year] = datePart.split("/");
      const [hours, minutes] = timePart.split(":");
      parsedMeasurementTime = new Date(year, month - 1, day, hours, minutes);
    } else {
      parsedMeasurementTime = new Date();
    }

    const newReading = {
      lastCheckupDate,
      measurementTime: parsedMeasurementTime,
      notes: notes || "",
    };

    // 🔍 Check if user already has a FullBodyCheckup record
    let userCheckup = await FullBodyCheckup.findOne({ userId });

    if (userCheckup) {
      userCheckup.readings.push(newReading);
      await userCheckup.save();
      return res.status(200).json({
        status: "success",
        message: "Full Body Checkup reading added successfully",
        data: userCheckup,
      });
    } else {
      const newRecord = new FullBodyCheckup({
        userId,
        readings: [newReading],
      });
      await newRecord.save();
      return res.status(201).json({
        status: "success",
        message: "New Full Body Checkup record created",
        data: newRecord,
      });
    }
  } catch (err) {
    console.error("Add Full Body Checkup Error:", err.message);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ Get latest Full Body Checkup reading
export const getLatestFullBodyCheckupReading = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const userCheckup = await FullBodyCheckup.findOne({ userId });

    if (!userCheckup || userCheckup.readings.length === 0) {
      return res
        .status(404)
        .json({ message: "No Full Body Checkup readings found", data: null });
    }

    const latestReading =
      userCheckup.readings[userCheckup.readings.length - 1];

    const formattedReading = {
      ...latestReading.toObject(),
      measurementTime: latestReading.measurementTime.toISOString(),
    };

    res.status(200).json({
      message: "Latest Full Body Checkup reading fetched successfully",
      data: formattedReading,
    });
  } catch (err) {
    console.error("Get Latest Full Body Checkup Error:", err.message);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};






















// export const addBloodPressureReading = async (req, res) => {
//     try {
//         const userId = req.user?._id || req.body.userId;
//         const {
//             quickEntry,
//             systolic,
//             diastolic,
//             pulse,
//             arm,
//             position,
//             measurementTime,
//             notes
//         } = req.body;

//         if (!userId || !systolic || !diastolic) {
//             return res.status(400).json({
//                 message: "userId, systolic, and diastolic values are required"
//             });
//         }

//         // 🔹 Find existing record for user
//         let userBP = await BloodPressure.findOne({ userId });

//         const newReading = {
//             quickEntry,
//             systolic,
//             diastolic,
//             pulse,
//             arm,
//             position,
//             measurementTime,
//             notes
//         };

//         if (userBP) {
//             userBP.readings.push(newReading);
//             await userBP.save();
//             return res.status(200).json({
//                 status: "success",
//                 message: "Blood pressure reading added successfully",
//                 data: userBP
//             });
//         } else {
//             const newRecord = new BloodPressure({
//                 userId,
//                 readings: [newReading]
//             });
//             await newRecord.save();
//             return res.status(201).json({
//                 status: "success",
//                 message: "New blood pressure record created",
//                 data: newRecord
//             });
//         }
//     } catch (err) {
//         console.error("Add Blood Pressure Error:", err.message);
//         res.status(500).json({
//             message: "Server error",
//             error: err.message
//         });
//     }
// };


// export const getLatestBloodPressure = async (req, res) => {
//     try {
//         const userId = req.user?._id || req.params.userId;

//         if (!userId) {
//             return res.status(400).json({ message: "userId is required" });
//         }

//         const userBP = await BloodPressure.findOne({ userId });

//         if (!userBP || userBP.readings.length === 0) {
//             return res.status(404).json({
//                 message: "No blood pressure readings found for this user",
//                 data: []
//             });
//         }

//         // 🕒 Get last added reading
//         const latestReading = userBP.readings[userBP.readings.length - 1];

//         res.status(200).json({
//             message: "Latest blood pressure reading fetched successfully",
//             data: latestReading
//         });
//     } catch (err) {
//         console.error("Get Latest Blood Pressure Error:", err.message);
//         res.status(500).json({
//             message: "Server error",
//             error: err.message
//         });
//     }
// };
