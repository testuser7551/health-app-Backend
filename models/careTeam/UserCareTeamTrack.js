// models/careTeam/UserCareTeamTrack.js
import mongoose from "mongoose";

const userCareTeamTrackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HealthcareProvider",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const UserCareTeamTrack = mongoose.model("usercareteamtracks", userCareTeamTrackSchema);
export default UserCareTeamTrack;
