import * as THREE from 'three';

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 3);
  return camera;
}

export function setCameraView(camera) {
  if (camera) camera.lookAt(0, 0, 0);
}

export function resetCamera(camera) {
  camera.position.set(0, 1.5, 3);
  camera.lookAt(0, 0, 0);
}

export function setFrontView(camera) {
  camera.position.set(0, 1.5, 3);
  camera.lookAt(0, 1.5, 0);
}

export function setTopView(camera) {
  camera.position.set(0, 4, 0);
  camera.lookAt(0, 0, 0);
}

export function setSideView(camera) {
  camera.position.set(3, 1.5, 0);
  camera.lookAt(0, 1.5, 0);
}

export function setIsoFront(camera) {
  camera.position.set(2.5, 2.5, 2.5);
  camera.lookAt(0, 1.5, 0);
}

export function setIsoBack(camera) {
  camera.position.set(-2.5, 2.5, -2.5);
  camera.lookAt(0, 1.5, 0);
}

export function setIsoLeft(camera) {
  camera.position.set(-2.5, 2.5, 2.5);
  camera.lookAt(0, 1.5, 0);
}

export function setIsoRight(camera) {
  camera.position.set(2.5, 2.5, -2.5);
  camera.lookAt(0, 1.5, 0);
}

export function fitModelToView(camera, model) {
  if (!camera || !model) return { size: new THREE.Vector3(), center: new THREE.Vector3(), distance: 0 };

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim * 1.8;

  camera.position.copy(center);
  camera.position.z += distance;
  camera.lookAt(center);

  return { size, center, distance };
}
