import test from 'node:test';
import assert from 'node:assert/strict';
import { analyseRates } from '../src/lib/market.ts';

const points = rates => rates.map((rate, i) => ({ date: `2025-01-${String(i + 1).padStart(2, '0')}`, rate }));
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);

test('drawdown uses the running high, while performance uses the first observation', () => {
  const result = analyseRates(points([100, 110, 99]));
  near(result.change, -1);
  near(result.maxDrawdown, -10);
  near(result.series[0].indexed, 100);
  near(result.series[1].drawdown, 0);
  near(result.series[2].indexed, 99);
});

test('volatility uses sample standard deviation of daily log changes', () => {
  const result = analyseRates(points([100, 110, 99]));
  const difference = Math.log(1.1) - Math.log(0.9);
  near(result.volatility, Math.abs(difference) / Math.sqrt(2) * Math.sqrt(252) * 100);
});

test('flat rates have no change, volatility or drawdown', () => {
  const result = analyseRates(points([1, 1, 1]));
  near(result.change, 0); near(result.volatility, 0); near(result.maxDrawdown, 0);
});

test('a new window resets the running high and baseline', () => {
  const result = analyseRates(points([120, 100, 110]).slice(1));
  near(result.change, 10); near(result.maxDrawdown, 0);
});

test('rejects insufficient, nonfinite and nonpositive prices', () => {
  for (const rates of [[], [1], [1, 0], [1, -1], [1, NaN], [1, Infinity]]) {
    assert.throws(() => analyseRates(points(rates)));
  }
});
