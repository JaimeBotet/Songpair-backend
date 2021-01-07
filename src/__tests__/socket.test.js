const db = require('../models');
import { updateSocket, getSocket,} from "../controllers/socket-controller";

jest.mock('db');

describe("socket test-suite", () => {

    const user = {
      _id = "5fc9ff9ed8206b6ac83ad9cb"
    }
    const socket = "D5c1vgxXjx5_USQLAABK";
    const receiver = "bhydnod4radusm2xujyld1ykb";


    it("get the socket of a chat room", () => {
        db.User.findOne.mockResolvedValue(user);
        db.Socket.findOne.mockResolvedValue(socket);
        const result = await getSocket(receiver);
        expect(result).toEqual(socket);
    });

    it.skip("another socket test", () => {
        // expect(updateSocket(token,socketID)).toEqual('socket');
    })

});