import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function setupControls(camera, rendererDomElement) {
  const controls = new OrbitControls(camera, rendererDomElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 1, 0);
  controls.update();
  return controls;
}
