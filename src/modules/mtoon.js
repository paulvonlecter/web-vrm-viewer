import * as THREE from 'three';

export function applyMToonToVRM(vrm) {
  if (!vrm || !vrm.scene) return;

  vrm.materials.forEach((material, index) => {
    if (material.isMToonMaterial || !material.isMeshStandardMaterial) {
      return;
    }

    material.metalness = 0;
    material.roughness = 0.5;
  });

  console.log('✅ MToon применён к VRM модели');
}

export function applyMToonForcibly(scene) {
  if (!scene) return;

  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      const material = child.material;

      // Если материал уже MToon — пропускаем
      if (material.isMToonMaterial) return;

      try {
        // Настраиваем стандартный материал под стилистику MToon
        material.metalness = 0;
        material.roughness = 0.5;

        // Для физических материалов настраиваем дополнительные параметры
        if (material.isMeshStandardMaterial) {
          material.clearcoat = 0.3;
          material.clearcoatRoughness = 0.1;
        }

        // Безопасно работаем с цветом — проверяем существование и тип
        if (material.color) {
          if (material.color.isColor) {
            // Если это объект Color — используем set
            material.color.set(0xff6b6b);
          } else if (typeof material.color === 'number') {
            // Если цвет задан числом — просто присваиваем
            material.color = 0xff6b6b;
          }
        } else {
          // Если свойства color нет — создаём новый объект Color
          material.color = new THREE.Color(0xff6b6b);
        }

        console.log(`🎨 Применён MToon стиль к материалу: ${material.name || 'без имени'}`);
      } catch (materialError) {
        console.warn(`⚠️ Ошибка обработки материала ${material.name}:`, materialError);
      }
    }
  });

  console.log('✅ Принудительное применение MToon завершено');
}

export function configureMToon(material, options = {}) {
  const defaults = {
    color: new THREE.Color(0xff6b6b),
    shadeColor: new THREE.Color(0xcc5252),
    rimColor: new THREE.Color(0xffe066),
    shininess: 80,
    outlineWidth: 0.01
  };

  const config = { ...defaults, ...options };

  try {
    if (material.uniforms) {
      // Для кастомных шейдеров
      material.uniforms.color.value.copy(config.color);
      material.uniforms.shadeColor.value.copy(config.shadeColor);
      material.uniforms.rimColor.value.copy(config.rimColor);
      material.uniforms.shininess.value = config.shininess;
      material.uniforms.outlineWidth.value = config.outlineWidth;
    } else {
      // Для стандартных материалов
      if (material.color && material.color.isColor) {
        material.color.copy(config.color);
      } else if (material.color !== undefined) {
        // Если color есть, но не объект Color
        material.color = config.color.getHex();
      } else {
        // Если свойства color нет
        material.color = config.color;
      }
    }

    material.needsUpdate = true;
  } catch (error) {
    console.warn('⚠️ Ошибка настройки MToon для материала:', error);
  }

  return material;
}
