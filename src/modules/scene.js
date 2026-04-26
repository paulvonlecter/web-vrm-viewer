import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB);

  // Окружающее освещение — увеличиваем интенсивность
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Направленный свет 1 — увеличиваем интенсивность и меняем позицию
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight1.position.set(5, 5, 5);
  scene.add(directionalLight1);

  // Дополнительный направленный свет с противоположной стороны
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight2.position.set(-5, 3, -5);
  scene.add(directionalLight2);

  return scene;
}
