import * as THREE from 'three';
import {
  createCamera, setCameraView, resetCamera, fitModelToView,
  setFrontView, setTopView, setSideView,
  setIsoFront, setIsoBack, setIsoLeft, setIsoRight
} from './modules/camera.js';
import { setupControls } from './modules/controls.js';
import { createScene } from './modules/scene.js';
import { loadVRM, unloadVRM } from './modules/loader.js';
import { applyMToonForcibly } from './modules/mtoon.js';
import { setGreetingPose } from './modules/poses.js';


let scene, camera, renderer, vrm;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function debugVRMBones(vrm) {
  if (vrm && vrm.humanoid && vrm.humanoid.humanBones) {
    console.log('Доступные кости:');
    Object.keys(vrm.humanoid.humanBones).forEach(boneName => {
      console.log(`- ${boneName}`);
    });
  } else {
    console.warn('humanBones не найден');
  }
}

async function init() {
  scene = createScene();
  camera = createCamera();
  setCameraView(camera);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const viewer = document.getElementById('viewer');
  viewer.appendChild(renderer.domElement);

  setupControls(camera, renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

  // Обработчики кнопок видов камеры
  document.getElementById('frontView').addEventListener('click', () => setFrontView(camera));
  document.getElementById('topView').addEventListener('click', () => setTopView(camera));
  document.getElementById('sideView').addEventListener('click', () => setSideView(camera));
  document.getElementById('isoFront').addEventListener('click', () => setIsoFront(camera));
  document.getElementById('isoBack').addEventListener('click', () => setIsoBack(camera));
  document.getElementById('isoLeft').addEventListener('click', () => setIsoLeft(camera));
  document.getElementById('isoRight').addEventListener('click', () => setIsoRight(camera));
  document.getElementById('resetView').addEventListener('click', () => resetCamera(camera));

// Загрузка модели
const fileInput = document.getElementById('vrmFile');
fileInput.addEventListener('change', async (event) => {
  if (vrm) vrm = unloadVRM(scene, vrm);

  vrm = await loadVRM(event, scene);
  if (vrm && vrm.scene) {
    vrm.scene.rotation.y = Math.PI;
    fitModelToView(camera, vrm.scene);

    // Применяем шейдеры MToon
    applyMToonForcibly(scene);

    // Ждём следующего кадра и полного обновления сцены
    setTimeout(() => {
      setGreetingPose(vrm);
      // Ещё раз обновляем матрицу после установки позы
      vrm.scene.updateMatrixWorld(true);
      renderer.render(scene, camera); // Принудительный рендер
    }, 200);
  }
});




  // Обработчик кнопки выгрузки модели
  document.getElementById('unloadBtn').addEventListener('click', () => {
    if (vrm) {
      vrm = unloadVRM(scene, vrm);
      resetCamera(camera); // Возвращаем камеру в исходное положение
    }
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
