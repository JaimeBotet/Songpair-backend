const UserModel = require("./user-model");
const LikeModel = require("./like-model");
const RoomModel = require("./room-model");
const SocketModel = require("./socket-model");

module.exports = {
  User: UserModel,
  Like: LikeModel,
  Room: RoomModel,
  Socket: SocketModel,
};
