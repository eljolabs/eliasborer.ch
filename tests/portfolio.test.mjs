import test from 'node:test';
import assert from 'node:assert/strict';
import { changeAllocation } from '../src/lib/portfolio.ts';
import { stressPortfolio } from '../src/lib/stress.ts';
test('moderate 60/30/10 shock has independently calculated losses', () => {
  const r = stressPortfolio({stocks:60,bonds:30,cash:10},1);
  assert.equal(r.loss,1650);
  assert.equal(r.lossPercent,16.5);
  assert.equal(r.remaining,8350);
  assert.equal(r.driver,'Equities');
  assert.equal(r.series[0].loss,0);
  assert.equal(r.series[5].loss,825);
  assert.equal(r.series[10].loss,1650);
});
test('asset endpoints, severe duration shock and cash baseline', () => {
  assert.equal(stressPortfolio({stocks:100,bonds:0,cash:0},2).loss,4000);
  assert.equal(stressPortfolio({stocks:0,bonds:100,cash:0},2).loss,1000);
  assert.equal(stressPortfolio({stocks:0,bonds:100,cash:0},2).driver,'Bonds');
  const r = stressPortfolio({stocks:0,bonds:0,cash:100},2);
  assert.equal(r.remaining,10000);
  assert.equal(r.driver,'None');
});
test('all allocations preserve integer nonnegative weights and total 100', () => {
  for(const asset of ['stocks','bonds','cash']) for(let value=0;value<=100;value++) {
    const w=changeAllocation({stocks:60,bonds:30,cash:10},asset,value);
    assert.equal(w[asset],value);
    assert.equal(Object.values(w).reduce((a,b)=>a+b),100);
    assert.ok(Object.values(w).every(n=>Number.isInteger(n)&&n>=0));
    for(let scenario=0;scenario<3;scenario++) assert.ok(stressPortfolio(w,scenario).remaining>=6000);
  }
});
test('invalid scenarios and allocations are rejected',()=> {
  for(const s of [-1,3,0.5,NaN]) assert.throws(()=>stressPortfolio({stocks:60,bonds:30,cash:10},s));
  for(const w of [{stocks:NaN,bonds:30,cash:10},{stocks:60,bonds:30,cash:0},{stocks:-1,bonds:101,cash:0}]) assert.throws(()=>stressPortfolio(w,1));
});
test('zero remaining weights redistribute evenly and equal contributors are labelled', () => {
  assert.deepEqual(changeAllocation({stocks:100,bonds:0,cash:0},'stocks',0),{stocks:0,bonds:50,cash:50});
  assert.equal(stressPortfolio({stocks:10,bonds:50,cash:40},1).driver,'Equal');
  assert.equal(stressPortfolio({stocks:60,bonds:30,cash:10},0).loss,675);
});
