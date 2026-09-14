import { useState } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { changeAllocation, type Asset, type Weights } from '../lib/portfolio';
import { scenarios, stressPortfolio } from '../lib/stress';

const initial: Weights = { stocks: 60, bonds: 30, cash: 10 };
const assets: { key: Asset; label: string }[] = [
  { key: 'stocks', label: 'Swiss equities' },
  { key: 'bonds', label: 'CHF bonds' },
  { key: 'cash', label: 'CHF cash' },
];
const francs = (n: number) => `CHF ${new Intl.NumberFormat('de-CH', {maximumFractionDigits: 0}).format(n)}`;

export default function PortfolioRiskLab() {
  const [weights, setWeights] = useState<Weights>(initial);
  const [scenario, setScenario] = useState(1);
  const result = stressPortfolio(weights, scenario);
  const selected = scenarios[scenario];
  return <section className="analytics-terminal portfolio-lab" aria-labelledby="lab-title">
    <header className="lab-header">
      <div><h2 id="lab-title"><span aria-hidden="true">&gt;_</span> Portfolio Stress Lab</h2>
        <p className="mono">CHF · Hypothetical scenarios</p></div>
      <button className="icon-btn" title="Reset scenario and portfolio" aria-label="Reset scenario and portfolio" onClick={() => {setWeights(initial); setScenario(1);}}><RotateCcw size={15}/></button>
    </header>
    <fieldset className="stress-presets">
      <legend className="sr-only">Stress scenario</legend>
      {scenarios.map((s, i) => <label key={s.label}>
        <input type="radio" name="stress-scenario" checked={scenario === i} onChange={() => setScenario(i)}/>
        <span>{s.label}</span>
      </label>)}
    </fieldset>
    <p className="stress-assumption mono">Equities −{selected.equityLoss}% · Yields +{selected.rateRise.toFixed(1)} pp</p>
    <div className="allocation-controls">
      {assets.map(asset => <div className={`allocation-row ${asset.key}`} key={asset.key}>
        <label htmlFor={`weight-${asset.key}`}><i aria-hidden="true"/>{asset.label}</label>
        <input id={`weight-${asset.key}`} type="range" min="0" max="100" step="1" value={weights[asset.key]}
          aria-label={`${asset.label} allocation`} aria-valuetext={`${weights[asset.key]} percent`}
          title="Other weights adjust proportionally to keep the total at 100%."
          onChange={e => setWeights(current => changeAllocation(current, asset.key, Number(e.target.value)))}/>
        <output htmlFor={`weight-${asset.key}`}>{weights[asset.key]}<span>%</span></output>
      </div>)}
    </div>
    <div className="lab-chart-heading mono"><span>Loss on {francs(10000)}</span><strong>{francs(result.loss)}</strong></div>
    <div className="live-chart lab-chart" role="img" aria-label={`Hypothetical loss versus shock intensity, not time. Full scenario loss ${francs(result.loss)}.`}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={result.series} margin={{top:10, right:12, left:-10, bottom:0}} accessibilityLayer>
          <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 5"/>
          <XAxis dataKey="intensity" type="number" domain={[0,100]} ticks={[0,50,100]} tickFormatter={v => `${v}%`} tick={{fontSize:10,fill:'var(--muted)'}} tickLine={false} axisLine={false}/>
          <YAxis domain={[0,4000]} ticks={[0,2000,4000]} width={48} tickFormatter={v => `${v/1000}k`} tick={{fontSize:10,fill:'var(--muted)'}} tickLine={false} axisLine={false}/>
          <Tooltip contentStyle={{background:'var(--surface)',border:'1px solid var(--line)',borderRadius:4,fontSize:11}} labelFormatter={v => `${v}% of selected shock`} formatter={v => [typeof v === 'number' ? francs(v) : v, 'Loss']}/>
          <Line dataKey="loss" type="linear" stroke="var(--cyan)" strokeWidth={2.4} dot={false} activeDot={{r:4}} isAnimationActive={false}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
    <p className="stress-axis mono">Shock intensity · not a time series</p>
    <div className="terminal-metrics lab-metrics" aria-live="polite" aria-atomic="true">
      <div className="terminal-metric"><span>Portfolio loss</span><strong>{result.lossPercent.toFixed(1)}%</strong><small>At full shock</small></div>
      <div className="terminal-metric"><span>Remaining CHF</span><strong>{new Intl.NumberFormat('de-CH').format(result.remaining)}</strong><small>From CHF 10’000</small></div>
      <div className="terminal-metric"><span>Main loss driver</span><strong>{result.driver}</strong><small>By CHF contribution</small></div>
    </div>
    <details className="lab-method"><summary>Model & assumptions <ChevronDown size={13}/></summary>
      <p>Original illustrative assumptions, not observed market data, a forecast or an investment recommendation. Scenario labels do not represent probabilities or historical events. All values are in CHF.</p>
      <p>Equities fall by the stated percentage. CHF bond prices use a fixed modified duration of 5 years: price change ≈ −5 × yield change. This linear approximation ignores convexity, credit spreads and defaults. The same relative shock intensity applies to both asset classes.</p>
      <p>An instantaneous shock with unchanged holdings: no interest accrual, coupons, rebalancing, fees, tax, inflation or FX effects. Cash remains at nominal value in this model, not because cash is risk-free. No historical prices, third-party financial datasets or external data feeds are used.</p>
    </details>
  </section>;
}
