import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userdaytrackschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: true
  },
  day: { type: Number, required: true},
}, { timestamps: true });

const UserDayTrack = mongoose.model("userdaytrack", userdaytrackschema);
export default UserDayTrack;
