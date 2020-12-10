const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");
require("dotenv").config();

const LikeSchema = new mongoose.Schema(
  {
    senderID : {
      type: String,
      required: [true, "Like sender is required"],
      ref: "user"
    },
    receiverID : {
      type: String,
      required: [true, "Like receiver is required"],
      ref: "user"
    },
    song: {
      uri: {type: String},
      image: {type: Array},
      music: {type: String},
      artist: {type: String},
    },
  },
  {
    timestamps: true,
  },
);

LikeSchema.plugin(beautifyUnique);

const Like = mongoose.model("like", LikeSchema);

module.exports = Like;