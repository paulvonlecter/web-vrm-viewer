import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin } from '@pixiv/three-vrm';
import { applyMToonForcibly, configureMToon } from './mtoon.js';

export async function loadVRM(event, scene) {
  var file;
  if (event.type == 'change') {
    file = event.target.files[0];
  }
  else if (event.type == 'drop') {
    if (event.dataTransfer.items) {
        file = event.dataTransfer.items[0].getAsFile();
    } else {
        file = event.dataTransfer.files[0];
    }
  }
  if (!file) {
    console.error('❌ Файл не выбран');
    return null;
  }

  try {
    console.log('📁 Начинаем загрузку файла:', file.name);
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
    const gltf = await loader.loadAsync(URL.createObjectURL(file));

    // Инициализируем VRM
    const vrm = gltf.userData.vrm;
    if (!vrm) {
      console.error('💥 VRM не найден в загруженном файле');
      return null;
    }
    if (vrm.meta && vrm.meta.version) {
      console.log(`Загружена VRM версии: ${vrm.meta.version}`);
    }

    scene.add(vrm.scene);
    applyMToonForcibly(scene);

    console.log('✅ VRM успешно загружен и инициализирован');
    return vrm; // Возвращаем полный объект VRM
  } catch (error) {
    console.error('💥 Ошибка загрузки:', error);
    alert(`Не удалось загрузить модель: ${error.message}`);
    return null;
  }
}


export function unloadVRM(scene, vrm) {
  if (vrm && vrm.scene) {
    scene.remove(vrm.scene);
    vrm.dispose?.(); // Освобождаем ресурсы VRM, если метод доступен
  }
  // Сбрасываем ссылку на модель
  return null;
}
