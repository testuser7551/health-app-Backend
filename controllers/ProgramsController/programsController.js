// @desc Get all programs
import Program from "../../models/Program.js"; // path from controller
import UserProgramTrack from "../../models/UserProgramTrack.js";
import UserDayTrack from "../../models/UserDayTrack.js";

// Fetch the All Programs
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(programs);
  } catch (err) {
    console.error("Get All Programs Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// User Enroll the Program
export const enrollUserToProgram = async (req, res) => {
  try {
    const userId = req.user._id;
    const { programId } = req.body;

    if (!userId || !programId) {
      return res.status(400).json({ message: "userId and programId are required" });
    }

    // Check if program exists
    const programExists = await Program.findById(programId);
    if (!programExists) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Check if already enrolled
    const existingTrack = await UserProgramTrack.findOne({ userId, programId });
    if (existingTrack) {
      return res.status(200).json({ message: "User already enrolled in this program" });
    }

    // Create enrollment record
    const newEnrollment = new UserProgramTrack({
      userId,
      programId,
      enroll: 1, // enrolled
    });

    await newEnrollment.save();

    res.status(201).json({
      message: "User successfully enrolled in program",
      enrollment: newEnrollment,
    });
  } catch (err) {
    console.error("Enroll User Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Post the User Day activity Completion
export const trackUserDay = async (req, res) => {
  try {
    const userId = req.user._id;

    const { programId, day } = req.body;

    // Validate required fields
    if (!userId || !programId || !day) {
      return res.status(400).json({ message: "userId, programId, and day are required" });
    }

    // Check if program exists
    const programExists = await Program.findById(programId);
    if (!programExists) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Check if the user already tracked this day
    const existingTrack = await UserDayTrack.findOne({ userId, programId, day });
    if (existingTrack) {
      return res.status(400).json({ message: `Day ${day} already tracked for this user` });
    }

    // Create new day track record
    const newDayTrack = new UserDayTrack({
      userId,
      programId,
      day,
    });

    await newDayTrack.save();

    res.status(201).json({
      status:"Success",
      message: `User progress tracked for day ${day}`,
      track: newDayTrack,
    });
  } catch (err) {
    console.error("Track User Day Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch the User Current Program Details
export const getProgramProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const { programId } = req.query;
    const userProgram = await UserProgramTrack.findOne({ userId, programId });
    if (!userId || !programId) {
      return res.status(400).json({ message: "userId and programId are required" });
    }

    // Get the program
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const totalDays = parseInt(program.days, 10);

    // Get user's tracked days
    const trackedDays = await UserDayTrack.find({ userId, programId })
      .sort({ createdAt: 1 }); // oldest → newest

    const completedDays = trackedDays.length;
    const remainingDays = totalDays - completedDays;
    const currentDayToComplete = completedDays < totalDays ? completedDays + 1 : totalDays;

    // ✅ Calculate streak
    let streak = 0;
    if (trackedDays.length > 0) {
      streak = 1; // start with one day streak
      for (let i = 1; i < trackedDays.length; i++) {
        const prev = new Date(trackedDays[i - 1].createdAt);
        const curr = new Date(trackedDays[i].createdAt);

        // Check if current day is exactly 1 day after previous
        const diffInDays = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));

        if (diffInDays === 1) {
          streak += 1; // consecutive day → increase streak
        } else if (diffInDays > 1) {
          streak = 1; // missed one or more days → reset streak
        }
      }

      // If last completion is older than yesterday → streak should reset
      const lastCompletion = new Date(trackedDays[trackedDays.length - 1].createdAt);
      const now = new Date();
      const diffFromToday = Math.floor((now - lastCompletion) / (1000 * 60 * 60 * 24));
      if (diffFromToday > 1) streak = 0;
    }

    res.status(200).json({
      currentProgram: program,
      enrolled: userProgram ? true : false,
      totalDays,
      completedDays,
      remainingDays,
      currentDayToComplete,
      isCompleted: completedDays >= totalDays,
      streak,
      message:
        completedDays >= totalDays
          ? "Program completed!"
          : `Continue from Day ${currentDayToComplete}. Current streak: ${streak} 🔥`,
    });
  } catch (err) {
    console.error("Get Program Progress Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};