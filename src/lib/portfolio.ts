import { sampleStandardDeviation } from "simple-statistics";

export type Asset = "stocks" | "bonds" | "cash";
export type Weights = Record<Asset, number>;
export interface AnnualReturn extends Weights {
  year: number;
}
const assets: Asset[] = ["stocks", "bonds", "cash"];

export function validateWeights(weights: Weights) {
  if (
    assets.some(
      (asset) =>
        !Number.isFinite(weights[asset]) ||
        weights[asset] < 0 ||
        weights[asset] > 100,
    ) ||
    Math.abs(assets.reduce((sum, asset) => sum + weights[asset], 0) - 100) >
      1e-8
  ) {
    throw new Error(
      "Allocation must contain nonnegative percentages summing to 100.",
    );
  }
}

export function changeAllocation(
  weights: Weights,
  asset: Asset,
  value: number,
): Weights {
  validateWeights(weights);
  if (!Number.isFinite(value)) throw new Error("Weight must be finite.");
  const next = Math.max(0, Math.min(100, Math.round(value)));
  const [first, second] = assets.filter((key) => key !== asset);
  const others = weights[first] + weights[second];
  const remainder = 100 - next;
  const firstWeight = Math.round(
    remainder * (others === 0 ? 0.5 : weights[first] / others),
  );
  return {
    ...weights,
    [asset]: next,
    [first]: firstWeight,
    [second]: remainder - firstWeight,
  };
}

export function simulatePortfolio(
  rows: AnnualReturn[],
  weights: Weights,
  initial = 10000,
) {
  validateWeights(weights);
  if (rows.length < 2 || !Number.isFinite(initial) || initial <= 0)
    throw new Error(
      "At least two annual observations and positive initial capital are required.",
    );
  rows.forEach((row, i) => {
    if (
      !Number.isInteger(row.year) ||
      (i > 0 && row.year !== rows[i - 1].year + 1) ||
      assets.some((asset) => !Number.isFinite(row[asset]) || row[asset] <= -1)
    )
      throw new Error("Returns must be valid and years consecutive.");
  });
  let value = initial,
    benchmark = initial,
    peak = initial,
    benchmarkPeak = initial;
  const returns: number[] = [];
  const series = [
    {
      year: rows[0].year - 1,
      value,
      benchmark,
      drawdown: 0,
      benchmarkDrawdown: 0,
      annualReturn: 0,
    },
  ];
  // Target weights are restored at each year's start; income is reinvested.
  for (const row of rows) {
    const annualReturn = assets.reduce(
      (sum, asset) => sum + (weights[asset] / 100) * row[asset],
      0,
    );
    returns.push(annualReturn);
    value *= 1 + annualReturn;
    benchmark *= 1 + row.stocks;
    peak = Math.max(peak, value);
    benchmarkPeak = Math.max(benchmarkPeak, benchmark);
    series.push({
      year: row.year,
      value,
      benchmark,
      drawdown: (value / peak - 1) * 100,
      benchmarkDrawdown: (benchmark / benchmarkPeak - 1) * 100,
      annualReturn: annualReturn * 100,
    });
  }
  const worstIndex = returns.indexOf(Math.min(...returns));
  return {
    series,
    finalValue: value,
    cagr: ((value / initial) ** (1 / rows.length) - 1) * 100,
    volatility: sampleStandardDeviation(returns) * 100,
    maxDrawdown: Math.min(...series.map((point) => point.drawdown)),
    worstYear: {
      year: rows[worstIndex].year,
      value: returns[worstIndex] * 100,
    },
  };
}
