export interface RatePoint {
  date: string;
  rate: number;
}

export function analyseRates(points: RatePoint[]) {
  if (
    points.length < 2 ||
    points.some((point) => !Number.isFinite(point.rate) || point.rate <= 0)
  ) {
    throw new Error("At least two positive reference rates are required.");
  }
  const returns = points
    .slice(1)
    .map((point, i) => Math.log(point.rate / points[i].rate));
  const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const variance =
    returns.length > 1
      ? returns.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
        (returns.length - 1)
      : 0;
  let peak = points[0].rate;
  const series = points.map((point) => {
    peak = Math.max(peak, point.rate);
    return {
      ...point,
      indexed: (point.rate / points[0].rate) * 100,
      drawdown: (point.rate / peak - 1) * 100,
    };
  });
  return {
    series,
    change: (points.at(-1)!.rate / points[0].rate - 1) * 100,
    volatility: Math.sqrt(variance * 252) * 100,
    maxDrawdown: Math.min(...series.map((point) => point.drawdown)),
  };
}
