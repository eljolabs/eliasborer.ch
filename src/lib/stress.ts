import { validateWeights, type Weights } from './portfolio.ts';

export const scenarios = [
  { label: 'Mild', equityLoss: 10, rateRise: 0.5 },
  { label: 'Moderate', equityLoss: 25, rateRise: 1 },
  { label: 'Severe', equityLoss: 40, rateRise: 2 },
] as const;

export function stressPortfolio(weights: Weights, scenario: number) {
  validateWeights(weights);
  if (!Number.isInteger(scenario) || scenario < 0 || scenario >= scenarios.length)
    throw new Error('Unknown scenario.');
  const selected = scenarios[scenario];
  // Instantaneous, first-order bond price sensitivity: -modified duration * yield change.
  const stocks = 10000 * weights.stocks / 100 * selected.equityLoss / 100;
  const bonds = 10000 * weights.bonds / 100 * 5 * selected.rateRise / 100;
  const loss = stocks + bonds;
  return {
    loss, lossPercent: loss / 100, remaining: 10000 - loss,
    driver: loss === 0 ? 'None' : stocks === bonds ? 'Equal' : stocks > bonds ? 'Equities' : 'Bonds',
    series: Array.from({length: 11}, (_, i) => ({ intensity: i * 10, loss: loss * i / 10 })),
  };
}
