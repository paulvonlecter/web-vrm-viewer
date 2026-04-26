import * as THREE from 'three';

let annotations = [];

export function addAnnotationPrompt(vrm) {
  if (!vrm || !vrm.humanoid) {
    alert('Сначала загрузите VRM‑модель!');
    return;
  }

  const boneNames = Object.keys(vrm.humanoid.humanBones);
  if (!boneNames.length) {
    alert('Модель не содержит костей для аннотирования');
    return;
  }

  const boneName = prompt(`Введите имя кости для аннотации.\nДоступные кости:\n${boneNames.join('\n')}`, '');
  if (!boneName) return;
  if (!vrm.humanoid.humanBones[boneName]) {
    alert(`Кость "${boneName}" не найдена в модели.`);
    return;
  }

  const text = prompt('Введите текст для выноски:', 'Описание части тела');
  if (!text) return;

  addAnnotation(vrm, boneName, text);
}

function addAnnotation(vrm, boneName, text, offset = new THREE.Vector3(0, 0.2, 0)) {
  const bone = vrm.humanoid.getBoneNode(boneName);
  if (!bone) return;

  const screenPos = getScreenPosition(bone, offset);
  const annotation = document.createElement('div');
  annotation.className = 'annotation';
  annotation.textContent = text;
  annotation.style.left = screenPos.x + 'px';
  annotation.style.top = screenPos.y + 'px';
  document.body.appendChild(annotation);
  annotations.push({ bone, element: annotation, offset });
}

function getScreenPosition(object, offset, camera) {
  const vector = new THREE.Vector3();
  object.getWorldPosition(vector).add(offset);
  vector.project(camera);
  vector.x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  vector.y = (0.5 - vector.y * 0.5) * window.innerHeight;
  return vector;
}

export function updateAnnotations(camera) {
  annotations.forEach(({ bone, element, offset }) => {
    if (bone && element) {
      const pos = getScreenPosition(bone, offset, camera);
      element.style.left = pos.x + 'px';
      element.style.top = pos.y + 'px';
    }
  });
}
