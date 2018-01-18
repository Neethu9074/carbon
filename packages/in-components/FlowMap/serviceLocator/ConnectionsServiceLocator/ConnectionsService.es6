import fragmentShader from 'in-map/singleMeshFactories/basicFragmentShader.glsl';
import vertexShader from 'in-map/singleMeshFactories/basicVertexShader.glsl';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import { LineSegments, BufferGeometry, RawShaderMaterial } from 'in-map/3DLibProvider';
import { updateAttribute } from 'in-map/services/geometryAttributes';

export default function createConnectionsService(serviceLocatorUid) {
  const connections = new Map();

  const geometry = new BufferGeometry();

  const material = new RawShaderMaterial({
    fragmentShader: fragmentShader,
    vertexShader: vertexShader,
    uniforms: {
      opacity: {
        type: 'f',
        value: 1.0
      }
    }
  });
  material.linewidth = 2;

  const line = new LineSegments(geometry, material);
  line.frustumCulled = false;

  function addOrSet(id, connection) {
    connections.set(id, connection);
  }

  function remove(id) {
    connections.delete(id);
  }

  function update() {
    const vertices = [];
    const colors = [];

    let currentArrayIndex = 0;
    const connectionVertices = connections.values();
    for (const v of connectionVertices) {
      vertices[currentArrayIndex] = v[0];
      colors[currentArrayIndex++] = 0.745;
      vertices[currentArrayIndex] = v[1];
      colors[currentArrayIndex++] = 0.8;
      vertices[currentArrayIndex] = v[2];
      colors[currentArrayIndex++] = 0.823;
      vertices[currentArrayIndex] = v[3];
      colors[currentArrayIndex++] = 0.745;
      vertices[currentArrayIndex] = v[4];
      colors[currentArrayIndex++] = 0.8;
      vertices[currentArrayIndex] = v[5];
      colors[currentArrayIndex++] = 0.823;
    }

    updateAttribute(geometry, 'position', vertices);
    updateAttribute(geometry, 'color', colors);

    getServiceLocators(serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .addSceneObject(line);
  }

  function dispose() {
    getServiceLocators(serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .removeSceneObject(line);
  }

  return {
    addOrSet,
    remove,
    update,
    dispose
  };
}
