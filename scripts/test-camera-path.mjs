import assert from 'node:assert/strict';
import { cameraPoses, sampleCamera } from '../components/celestial/cameraPath.ts';

const sample = value => {
  const position = [], target = [];
  sampleCamera(value, position, target);
  return { position, target };
};
let minimumClearance = Infinity;
for (let i = 0; i <= 4400; i++) {
  const { position, target } = sample(i / 1000);
  assert([...position, ...target].every(Number.isFinite), 'Camera contains a non-finite value');
  const radius = Math.hypot(...position);
  minimumClearance = Math.min(minimumClearance, radius - 1.404);
  assert(radius > 1.45, 'Camera intersects the lunar surface');
  assert(Math.hypot(...position.map((v, axis) => v-target[axis])) > .1, 'Camera look direction collapses');
}
for (const pose of cameraPoses) {
  const result = sample(pose.at);
  for (const field of ['position', 'target']) {
    result[field].forEach((value, i) => assert(Math.abs(value-pose[field][i]) < 1e-8));
  }
}
for (const pose of cameraPoses.slice(1,-1)) {
  const epsilon = .00001;
  const before = sample(pose.at-epsilon), center = sample(pose.at), after = sample(pose.at+epsilon);
  for (const field of ['position', 'target']) {
    for (let axis = 0; axis < 3; axis++) {
      const left = (center[field][axis]-before[field][axis])/epsilon;
      const right = (after[field][axis]-center[field][axis])/epsilon;
      assert(Math.abs(left-right) < .005, 'Camera velocity is discontinuous');
    }
  }
}
assert.deepEqual(sample(-1),sample(0));
assert.deepEqual(sample(10),sample(4.4));
console.log(`Camera path passed: 4,401 samples, continuous waypoint velocity, minimum surface clearance ${minimumClearance.toFixed(3)}.`);
