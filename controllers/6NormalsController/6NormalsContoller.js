import BloodPressure from "../../models/6normals/BloodPressure.js";

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

