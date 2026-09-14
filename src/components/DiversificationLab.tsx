import { useMemo, useState } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import {
  Area, CartesianGrid, ComposedChart, Line, ReferenceDot, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  bondVolatility, diversification, diversificationCurve, equityVolatility,
} from '../lib/diversification';

const initialWeight = 60;
const initialCorrelation = 0.2;
const signed = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}`;

export default function DiversificationLab() {
  const [weight, setWeight] = useState(initialWeight);
  const [correlation, setCorrelation] = useState(initialCorrelation);
  const curve = useMemo(() => diversificationCurve(correlation), [correlation]);
  const result = diversification(weight, correlation);

  return (
    <section className="analytics-terminal portfolio-lab diversification-lab" aria-labelledby="lab-title">
      <header className="lab-header">
        <div>
          <h2 id="lab-title"><span aria-hidden="true">&gt;_</span> Diversification Lab</h2>
          <p className="mono">Swiss allocation · Hypothetical model</p>
        </div>
        <button className="icon-btn" title="Reset allocation and correlation" aria-label="Reset allocation and correlation"
          onClick={() => { setWeight(initialWeight); setCorrelation(initialCorrelation); }}>
          <RotateCcw size={15} />
        </button>
      </header>

      <div className="div-assets">
        <div><i className="div-swatch equity" aria-hidden="true" /><span>Swiss equities</span><strong>{equityVolatility}%</strong></div>
        <div><i className="div-swatch bond" aria-hidden="true" /><span>CHF bonds</span><strong>{bondVolatility}%</strong></div>
      </div>
      <p className="div-assumption mono">Assumed annual volatility · not observed data</p>

      <div className="div-controls allocation-controls">
        <div className="div-control stocks">
          <div className="div-control-heading"><label htmlFor="div-weight">Equity allocation</label><output htmlFor="div-weight" className="mono">{weight}% <span>/ {100 - weight}% bonds</span></output></div>
          <div className="allocation-row div-range"><input id="div-weight" type="range" min="0" max="100" step="1"
            value={weight} aria-label="Equity allocation" aria-valuetext={`${weight} percent equities, ${100 - weight} percent bonds`}
            onChange={event => setWeight(Number(event.target.value))} /></div>
          <div className="div-allocation" aria-hidden="true"><span style={{width: `${weight}%`}} /><span style={{width: `${100 - weight}%`}} /></div>
        </div>
        <div className="div-control bonds">
          <div className="div-control-heading"><label htmlFor="div-correlation">Correlation <span className="mono">ρ</span></label><output htmlFor="div-correlation" className="mono">{signed(correlation)}</output></div>
          <div className="allocation-row div-range"><input id="div-correlation" type="range" min="-1" max="1" step="0.05"
            value={correlation} aria-label="Correlation" aria-valuetext={signed(correlation)}
            onChange={event => setCorrelation(Number(event.target.value))} /></div>
          <div className="div-scale mono"><span>−1 · opposite</span><span>0</span><span>+1 · together</span></div>
        </div>
      </div>

      <div className="div-chart-label mono">Annual volatility (%)</div>
      <div className="live-chart lab-chart div-chart" role="img"
        aria-label={`Hypothetical portfolio volatility versus equity allocation. Selected ${weight}% equities, correlation ${signed(correlation)}: volatility ${result.risk.toFixed(1)}%, reduction ${result.benefit.toFixed(1)} percentage points versus perfect positive correlation.`}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ComposedChart data={curve} margin={{top:12, right:12, left:-10, bottom:0}} accessibilityLayer>
            <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 5" />
            <XAxis dataKey="equityWeight" type="number" domain={[0,100]} ticks={[0,25,50,75,100]} minTickGap={20}
              tickFormatter={value => `${value}%`} tick={{fontSize:10,fill:'var(--muted)'}} tickLine={false} axisLine={false} />
            <YAxis domain={[0,20]} ticks={[0,5,10,15,20]} width={40}
              tick={{fontSize:10,fill:'var(--muted)'}} tickLine={false} axisLine={false} />
            <Tooltip content={({active, label}) => {
              if (!active || typeof label !== 'number') return null;
              const point = diversification(label, correlation);
              return <div className="div-tooltip"><span>{label}% equities</span><strong>{point.risk.toFixed(1)}% volatility</strong></div>;
            }} />
            <Area dataKey="band" type="linear" stroke="none" fill="var(--cyan)" fillOpacity={0.09} isAnimationActive={false} tooltipType="none" />
            <Line dataKey="baseline" name="Perfect correlation" type="linear" stroke="var(--muted)" strokeDasharray="4 5" strokeWidth={1.2} dot={false} activeDot={false} isAnimationActive={false} />
            <Line dataKey="risk" name="Portfolio volatility" type="linear" stroke="var(--cyan)" strokeWidth={2.5} dot={false} activeDot={{r:3}} isAnimationActive={false} />
            <ReferenceLine x={weight} stroke="var(--cyan)" strokeOpacity={0.4} strokeDasharray="2 4" />
            <ReferenceDot x={weight} y={result.risk} r={5} fill="var(--cyan)" stroke="var(--surface)" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="div-axis mono">Equity allocation</p>
      <div className="div-legend"><span><i aria-hidden="true" /> Portfolio</span><span><i aria-hidden="true" /> Perfect correlation (ρ = +1)</span></div>

      <div className="terminal-metrics lab-metrics div-metrics" aria-live="polite" aria-atomic="true">
        <div className="terminal-metric"><span>Portfolio volatility</span><strong>{result.risk.toFixed(1)}<em>%</em></strong><small>At selected allocation</small></div>
        <div className="terminal-metric"><span>Diversification benefit</span><strong>{result.benefit.toFixed(1)}<em>pp</em></strong><small>Below perfect-correlation baseline</small></div>
      </div>
      <details className="lab-method">
        <summary>Model & assumptions <ChevronDown size={13} /></summary>
        <p>Two hypothetical assets viewed in CHF, with assumed annual return volatility of 18% for Swiss equities and 6% for CHF bonds. These are original illustrative inputs, not measured market statistics. Correlation is a model input, not a forecast.</p>
        <p>Portfolio variance = w²σₑ² + (1 − w)²σᵦ² + 2w(1 − w)ρσₑσᵦ. Volatility is its square root. The dashed line holds the same allocation and volatilities at ρ = +1. The benefit is the difference in percentage points, not an expected return or a reduction in maximum loss.</p>
        <p>The curve compares allocations, not dates. No expected returns, fees, taxes, inflation or changing correlations are modelled. Zero volatility at perfect negative correlation is a mathematical edge case, not a claim of a risk-free investment. No historical financial datasets or external feeds are used. Educational illustration, not investment advice.</p>
      </details>
    </section>
  );
}
