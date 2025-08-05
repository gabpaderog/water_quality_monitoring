import {test, expect, describe} from "vitest";
import { getPHStatus } from "../utils/sensorStatusMapper";

describe("getPHStatus", () => {
  test("returns 'Acidic' for pH <= 5.5", () => {
    expect(getPHStatus(5).label).toBe("Acidic");
  });
});