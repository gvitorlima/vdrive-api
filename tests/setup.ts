import { writeFileSync } from "node:fs";
import path from "node:path";
import { beforeEach } from "vitest";

const dbDir = path.resolve(process.cwd(), "tests/database");

export function resetTestDatabase(): void {
  writeFileSync(path.join(dbDir, "automobiles.json"), "[]\n", "utf-8");
  writeFileSync(path.join(dbDir, "drivers.json"), "[]\n", "utf-8");
  writeFileSync(path.join(dbDir, "automobile-driver.json"), "[]\n", "utf-8");
}

beforeEach(() => {
  resetTestDatabase();
});
