export interface Fixing {
  date: string;
  value: number;
}

const day = 86400000;

export function annualSaronReturn(fixings: Fixing[], year: number): number {
  if (!Number.isInteger(year) || fixings.length < 2)
    throw new Error("A calendar year and daily fixings are required.");
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  const rows = fixings.map((fixing, index) => {
    const date = Date.parse(`${fixing.date}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(fixing.date) ||
      !Number.isFinite(date) ||
      new Date(date).toISOString().slice(0, 10) !== fixing.date ||
      !Number.isFinite(fixing.value) ||
      (index > 0 && fixing.date <= fixings[index - 1].date)
    )
      throw new Error(
        "Fixings must have valid dates and rates in strictly increasing order.",
      );
    return { date, rate: fixing.value / 100 };
  });
  if (rows[0].date > start || rows[rows.length - 1].date < end)
    throw new Error("Fixings must cover both calendar-year boundaries.");
  let factor = 1;
  let coveredDays = 0;
  // ACT/360: each fixing accrues through weekends/holidays to the next fixing.
  // Calendar-year stubs use the preceding fixing; no zero floor is applied.
  for (let i = 0; i < rows.length - 1; i++) {
    const from = Math.max(start, rows[i].date);
    const to = Math.min(end, rows[i + 1].date);
    if (to <= from) continue;
    if ((rows[i + 1].date - rows[i].date) / day > 7)
      throw new Error("Unexpected gap in daily SARON observations.");
    const days = (to - from) / day;
    const accrual = 1 + (rows[i].rate * days) / 360;
    if (accrual <= 0) throw new Error("Invalid interest accrual.");
    factor *= accrual;
    coveredDays += days;
  }
  if (coveredDays !== (end - start) / day)
    throw new Error("Incomplete calendar-year coverage.");
  return factor - 1;
}
