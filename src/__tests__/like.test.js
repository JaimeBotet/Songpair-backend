const db = require('../models');
import { getMusicLikes, getProfileLikes,} from "../controllers/like-controller";

jest.mock('db');

describe("like test-suite", () => {

    const user = "bhydnod4radusm2xujyld1ykb";
    const uri = "spotify:track:0TxMRiAvI1s0L821BJJWzx";
    const musicLikes = 3;
    const profileLikes = 3;


    
    it("get the Likes of a song", () => {
        db.Like.countDocuments.mockResolvedValue(musicLikes);
        const result = await getMusicLikes(user, uri);
        expect(result).toEqual(musicLikes);
    });

    it.skip("get the likes of a profile", () => {
        expect(getProfileLikes(user)).toEqual(profileLikes);
    })


});