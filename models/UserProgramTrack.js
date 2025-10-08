import mongoose from "mongoose";

const userprogramtrackschema = new mongoose.Schema({
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
  enroll: { type: Number, enum: [0, 1], default: 0 },
}, { timestamps: true });

const UserProgramTrack = mongoose.model("userprogramtrack", userprogramtrackschema);
export default UserProgramTrack;
