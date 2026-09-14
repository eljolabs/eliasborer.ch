export const equityVolatility = 18;
export const bondVolatility = 6;

export function diversification(equityWeight: number, correlation: number) {
  if (!Number.isFinite(equityWeight) || equityWeight < 0 || equityWeight > 100)
    throw new Error('Equity weight must be between 0 and 100.');
  if (!Number.isFinite(correlation) || correlation < -1 || correlation > 1)
    throw new Error('Correlation must be between -1 and 1.');

  const equity = equityWeight / 100 * equityVolatility;
  const bonds = (1 - equityWeight / 100) * bondVolatility;
  // Equivalent to the two-asset covariance formula, stable at correlation -1.
  const variance = (equity - bonds) ** 2 + 2 * equity * bonds * (1 + correlation);
  const risk = Math.sqrt(variance);
  const baseline = equity + bonds;
  return { risk, baseline, benefit: Math.max(0, baseline - risk) };
}

export function diversificationCurve(correlation: number) {
  return Array.from({ length: 101 }, (_, equityWeight) => {
    const point = diversification(equityWeight, correlation);
    return { equityWeight, ...point, band: [point.risk, point.baseline] };
  });
}
