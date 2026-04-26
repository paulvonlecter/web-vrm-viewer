import * as THREE from 'three';

export function setGreetingPose(vrm) {
  if (!vrm || !vrm.humanoid) {
    console.warn('❌ VRM или humanoid не доступны для установки позы');
    return;
  }

  const avatar = vrm.humanoid;

  // Используем getRawBoneNode() для прямого доступа к костям модели
  const rightUpperArm = avatar.getRawBoneNode('rightUpperArm');
  const rightLowerArm = avatar.getRawBoneNode('rightLowerArm');
  const leftUpperArm = avatar.getRawBoneNode('leftUpperArm');
  const head = avatar.getRawBoneNode('head');

  // Сохраняем исходные матрицы
  const originalMatrices = new Map();


  // Правая рука: поднимаем в жесте приветствия
  if (rightUpperArm) {
    originalMatrices.set(rightUpperArm, rightUpperArm.matrix.clone());
    rightUpperArm.rotation.set(
      THREE.MathUtils.degToRad(20),
      THREE.MathUtils.degToRad(45),
      THREE.MathUtils.degToRad(10)
    );
    rightUpperArm.updateMatrix(); // Принудительно обновляем матрицу
  }

  if (rightLowerArm) {
    originalMatrices.set(rightLowerArm, rightLowerArm.matrix.clone());
    rightLowerArm.rotation.set(
      THREE.MathUtils.degToRad(90),
      0,
      THREE.MathUtils.degToRad(10)
    );
    rightLowerArm.updateMatrix();
  }

  // Левая рука: расслабленно вдоль тела
  if (leftUpperArm) {
    originalMatrices.set(leftUpperArm, leftUpperArm.matrix.clone());
    leftUpperArm.rotation.set(
      THREE.MathUtils.degToRad(0),
      THREE.MathUtils.degToRad(5),
      THREE.MathUtils.degToRad(60)
    );
    leftUpperArm.updateMatrix();
  }

  // Голова: слегка наклоняем
  if (head) {
    originalMatrices.set(head, head.matrix.clone());
    head.rotation.set(
      THREE.MathUtils.degToRad(-5),
      0,
      0
    );
    head.updateMatrix();
  }

  // Принудительное обновление иерархии трансформаций
  vrm.scene.updateMatrixWorld(true);

  console.log('✅ Поза приветствия применена с обновлением матриц');
}
