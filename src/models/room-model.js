const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");
require("dotenv").config();

const RoomSchema = new mongoose.Schema(
  {
    creatorID : {
      type: String,
      required: [true, "Creator ID is required"],
      ref: "user"
    },
    participantID : {
      type: String,
      required: [true, "Participant ID is required"],
      ref: "user"
    }
  },
  {
    timestamps: true,
  },
);

RoomSchema.plugin(beautifyUnique);

const Room = mongoose.model("room", RoomSchema);

module.exports = Room;