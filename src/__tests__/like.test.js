import { getMusicLikes, getProfileLikes,} from "../controllers/like-controller";

/**
 * Finish the test
 */
describe("like test-suite", () => {

    const user = {
        receiverID = "1234"
    }

  it("get the Likes of a song", () => {
    expect(getMusicLikes).toEqual("something");
  });

  it("get the likes of a profile", () => {
      expect(getProfileLikes).toEqual("something");
  })


  //example tests & functions

  //Example 1
  function sanitizeUserData(user) {
    const { password, role, ...rest } = user;
    return rest;
  }
  test("sanitizeUserData returns an object without sensitive information", () => {
    const safeUserData = {
      firstName: "Alex",
      lastName: "Marks",
      age: 20,
      jobTitle: "Developer",
    };
  
    const userWithSensitiveInformation = {
      ...safeUserData,
      password: "a98dsj9a8sdj89asd89jasd",
      role: "ADMIN",
    };
  
    // Finish the test
    expect(sanitizeUserData(userWithSensitiveInformation)).toEqual(safeUserData);
  });
});