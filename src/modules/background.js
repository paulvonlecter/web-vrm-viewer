import * as THREE from 'three';

let currentBackground = null;

export function setBackground(scene, file) {
  // Если файл не передан, используем элемент из DOM
  const fileInput = document.getElementById('bgFile');
  const selectedFile = file || fileInput.files[0];

  if (!selectedFile) {
    alert('Пожалуйста, выберите изображение для фона');
    return;
  }

  // Очищаем предыдущий фон
  clearBackground(scene);

  const reader = new FileReader();
  reader.onload = function(e) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    textureLoader.load(
      e.target.result,
      (texture) => {
        scene.background = texture;
        currentBackground = texture;
        console.log('Фон успешно установлен');
      },
      undefined,
      (error) => {
        console.error('Ошибка загрузки фона:', error);
        alert('Не удалось загрузить изображение. Проверьте формат файла.');
      }
    );
  };
  reader.readAsDataURL(selectedFile);
}

export function clearBackground(scene) {
  if (currentBackground) {
    currentBackground.dispose();
    currentBackground = null;
  }
  scene.background = new THREE.Color(0xf0f0f0); // Возвращаем нейтральный серый
}
