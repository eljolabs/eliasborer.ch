import test from "node:test";
import assert from "node:assert/strict";
import { annualSaronReturn } from "../src/lib/saron.ts";
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-10, `${a} != ${b}`);
const days = (year, rate) => {
  const rows = [];
  for (
    let date = Date.UTC(year, 0, 1);
    date <= Date.UTC(year + 1, 0, 1);
    date += 86400000
  )
    rows.push({ date: new Date(date).toISOString().slice(0, 10), value: rate });
  return rows;
};
test("daily ACT/360 compounding handles negative rates and leap years", () => {
  near(annualSaronReturn(days(2024, 1), 2024), (1 + 0.01 / 360) ** 366 - 1);
  near(
    annualSaronReturn(days(2023, -0.75), 2023),
    (1 - 0.0075 / 360) ** 365 - 1,
  );
  near(annualSaronReturn(days(2023, 0), 2023), 0);
});
test("weekend accrual uses preceding fixing with simple interest over the gap", () => {
  const rows = days(2023, 1).filter(
    (row) => !["2023-01-07", "2023-01-08"].includes(row.date),
  );
  near(
    annualSaronReturn(rows, 2023),
    (1 + 0.01 / 360) ** 362 * (1 + (0.01 * 3) / 360) - 1,
  );
});
test("year-start holidays use the previous year fixing without accruing outside the year", () => {
  const rows = [{ date: "2022-12-30", value: 2 }, ...days(2023, 1).slice(2)];
  near(
    annualSaronReturn(rows, 2023),
    (1 + (0.02 * 2) / 360) * (1 + 0.01 / 360) ** 363 - 1,
  );
});
test("missing coverage, long gaps, duplicate dates and invalid fixings fail closed", () => {
  assert.throws(() => annualSaronReturn(days(2023, 1).slice(1), 2023));
  assert.throws(() => annualSaronReturn(days(2023, 1).slice(0, -1), 2023));
  assert.throws(() =>
    annualSaronReturn(
      days(2023, 1).filter((_, i) => i === 0 || i > 10),
      2023,
    ),
  );
  assert.throws(() =>
    annualSaronReturn(
      [{ date: "2023-01-01", value: NaN }, ...days(2023, 1)],
      2023,
    ),
  );
  assert.throws(() =>
    annualSaronReturn([days(2023, 1)[0], ...days(2023, 1)], 2023),
  );
});
