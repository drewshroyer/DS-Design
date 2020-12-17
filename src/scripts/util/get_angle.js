export function getAngleDeg(ex, ey, cx, cy) {
  let dy = ey - cy;
  let dx = ex - cx;
  let theta = Math.atan2(dy, dx);
  theta *= 180 / Math.PI;
  return theta;
}
