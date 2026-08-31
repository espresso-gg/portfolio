type Point = readonly [number, number, number];
type Pose = { at: number; position: Point; target: Point };

export const cameraPoses: readonly Pose[] = [
  { at: 0, position: [0, .08, 5.6], target: [0, -.3, 0] },
  { at: .7, position: [.2, .2, 4.85], target: [-.3, -.05, 0] },
  { at: 1.3, position: [.6, .3, 4.4], target: [-1.05, .05, 0] },
  { at: 2.25, position: [.9, .45, 4.1], target: [-1.0, .15, 0] },
  { at: 2.8, position: [1.05, .7, 3.65], target: [-.85, .3, 0] },
  { at: 3.5, position: [.75, 1.3, 2.8], target: [-.35, .7, -.6] },
  { at: 4, position: [.3, 1.72, 2.05], target: [0, 1.5, -1.5] },
  { at: 4.4, position: [0, 1.72, 1.65], target: [0, 1.6, -1.8] },
];

// Nonuniform cubic Hermite interpolation keeps velocity continuous at waypoints.
// Reuse caller-owned vectors: no allocation in the rendering loop.
export function sampleCamera(travel: number, position: number[], target: number[]) {
  const value = Math.max(0, Math.min(4.4, travel));
  let index = 0;
  while (index < cameraPoses.length - 2 && value > cameraPoses[index + 1].at) index++;
  const a = cameraPoses[index], b = cameraPoses[index + 1];
  const before = cameraPoses[Math.max(0, index - 1)];
  const after = cameraPoses[Math.min(cameraPoses.length - 1, index + 2)];
  const span = b.at - a.at;
  const t = (value - a.at) / span;
  const t2 = t * t, t3 = t2 * t;
  for (const field of ['position', 'target'] as const) {
    const out = field === 'position' ? position : target;
    for (let axis = 0; axis < 3; axis++) {
      const startSlope = index === 0 ? 0 : (b[field][axis] - before[field][axis]) / (b.at - before.at);
      const endSlope = index === cameraPoses.length - 2 ? 0 : (after[field][axis] - a[field][axis]) / (after.at - a.at);
      out[axis] = (2*t3-3*t2+1)*a[field][axis] + (t3-2*t2+t)*span*startSlope
        + (-2*t3+3*t2)*b[field][axis] + (t3-t2)*span*endSlope;
    }
  }
}
