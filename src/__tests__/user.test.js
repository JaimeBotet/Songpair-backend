import user from "../controllers/user-controller";

/**
 * Finish the test
 */
describe("user test-suite", () => {
  let addSpy = null;

  afterAll(() => {
    if (addSpy.hasOwnProperty("mockRestore")) {
      addSpy.mockRestore();
    }
  });

  beforeAll(() => {
    // 1. Spy on the 'add' method of the calculator object
    //    and save the spy in the `addSpy` variable
    addSpy = jest.spyOn(calculator, "add");
  });

  test("increment calls the calculator add method", () => {
    /**
     * 2. Execute the `increment` by passing the arguments: (4, 5, calculator)
     */
    increment(4, 5, calculator);
    //
    // 3. Make an assertion that the addSpy has been called 1 time
    //
    expect(addSpy).toHaveBeenCalledTimes(1);
    // 4. Make an assertion that the addSpy has been called with the
    // numbers 4 and 5
    //
    expect(addSpy).toHaveBeenCalledWith(4, 5);
  });
});