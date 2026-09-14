import test from 'node:test';
import assert from 'node:assert/strict';
import { diversification, diversificationCurve } from '../src/lib/diversification.ts';
const near = (a,b) => assert.ok(Math.abs(a-b) < 1e-9, `${a} != ${b}`);

test('default allocation agrees with independent covariance calculation', () => {
  const r = diversification(60,0.2);
  near(r.risk,Math.sqrt(0.6**2*18**2+0.4**2*6**2+2*0.6*0.4*0.2*18*6));
  near(r.baseline,13.2);
  near(r.benefit,13.2-r.risk);
});
test('single-asset endpoints are unaffected by correlation', () => {
  for (const rho of [-1,-0.5,0,0.5,1]) {
    near(diversification(0,rho).risk,6);
    near(diversification(100,rho).risk,18);
    near(diversification(0,rho).benefit,0);
    near(diversification(100,rho).benefit,0);
  }
});
test('perfect correlation equals the weighted volatility baseline', () => {
  for(let w=0;w<=100;w++) {
    const r=diversification(w,1);
    near(r.risk,r.baseline);
    near(r.benefit,0);
  }
});
test('perfect negative correlation cancels risk at 25 percent equities', () => {
  near(diversification(25,-1).risk,0);
  near(diversification(25,-1).benefit,9);
  near(diversification(50,-1).risk,6);
});
test('uncorrelated assets combine in quadrature, not arithmetic average', () => {
  near(diversification(50,0).risk,Math.sqrt(90));
});
test('curve has stable endpoints, finite values and nonnegative benefit', () => {
  for(const rho of [-1,-0.95,0,0.2,0.95,1]) {
    const curve=diversificationCurve(rho);
    assert.equal(curve.length,101);
    curve.forEach((p,i)=>{
      assert.equal(p.equityWeight,i);
      assert.ok(Number.isFinite(p.risk)&&p.risk>=0&&p.risk<=18+1e-9);
      assert.ok(p.benefit>=0);
      assert.deepEqual(p.band,[p.risk,p.baseline]);
    });
  }
});
test('lower correlation never increases risk at any allocation', () => {
  for(let w=0;w<=100;w++) for(let r=-1;r<1;r+=0.1)
    assert.ok(diversification(w,r).risk<=diversification(w,Math.min(1,r+0.1)).risk+1e-9);
});
test('invalid model inputs fail explicitly', () => {
  for(const w of [-1,101,NaN,Infinity]) assert.throws(()=>diversification(w,0));
  for(const r of [-1.01,1.01,NaN,Infinity]) assert.throws(()=>diversification(50,r));
});
