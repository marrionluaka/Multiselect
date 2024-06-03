import { helloWorld, goodBye, howAreYou } from "../src/index";

describe("Hello World Function", () => {
  it("should be a function", () => {
    expect(typeof helloWorld).toBe("function");
  });

  it("should return the hello world message", () => {
    const expected = "Hello World from my example modern npm package!";
    const actual = helloWorld();
    expect(actual).toBe(expected);
  });
});

describe("Goodbye Function", () => {
  it("should be a function", () => {
    expect(typeof goodBye).toBe("function");
  });

  it("should return the goodbye message", () => {
    const expected = "Goodbye from my example modern npm package!";
    const actual = goodBye();
    expect(actual).toBe(expected);
  });
});

describe("How Are You Function", () => {
  it("should be a function", () => {
    expect(typeof howAreYou).toBe("function");
  });

  it("should return the how are you message", () => {
    const expected = "How are you from my example modern npm package!!";
    const actual = howAreYou();
    expect(actual).toBe(expected);
  });
});
