const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");
require("dotenv").config();

const SocketSchema = new mongoose.Schema(
  {
    userID : {
      type: String,
      required: [true, "Token is required"],
      ref: "user"
    },
    socket : {
      type: String,
      required: [true, "Socket ID is required"],
    }
  },
  {
    timestamps: true,
  },
);

SocketSchema.plugin(beautifyUnique);

const Socket = mongoose.model("socket", SocketSchema);

module.exports = Socket;