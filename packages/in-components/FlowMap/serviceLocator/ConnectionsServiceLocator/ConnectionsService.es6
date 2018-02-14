import fragmentShader from 'in-map/singleMeshFactories/basicFragmentShader.glsl';
import vertexShader from 'in-map/singleMeshFactories/basicVertexShader.glsl';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import { LineSegments, BufferGeometry, RawShaderMaterial } from 'in-map/3DLibProvider';
import { createConnectionId } from 'in-components/FlowMap/sceneObjects/Connection';
import Connection from 'in-components/FlowMap/sceneObjects/Connection';
import { updateAttribute } from 'in-map/services/geometryAttributes';
import { diff } from 'in-services/arrayUtils';

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

  function set(nextConnectionConfigs) {
    nextConnectionConfigs = nextConnectionConfigs.map(config => {
      config.id = createConnectionId(config.from, config.to);
      return config;
    });

    const difference = diff(Array.from(connections.keys()), nextConnectionConfigs.map(config => config.id));
    remove(difference.uniqueItemsA);
    add(nextConnectionConfigs);
    updateAllConnectionPositions();
  }

  function add(newItems) {
    for (let i = 0; i < newItems.length; i++) {
      const connectionConfig = newItems[i];
      if (connections.has(connectionConfig.id)) {
        continue;
      }
      connections.set(
        connectionConfig.id,
        new Connection(serviceLocatorUid, connectionConfig.from, connectionConfig.to)
      );
    }
  }

  function remove(ids) {
    for (let i = 0; i < ids.length; i++) {
      const connection = connections.get(ids[i]);
      if (connection) {
        connection.dispose();
        connections.delete(connection.id);
      }
    }
  }

  function updateAllConnectionPositions() {
    const iterator = connections.values();
    for (const connection of iterator) {
      connection.updatePosition();
    }
  }

  function update() {
    const vertices = [];
    const colors = [];

    let currentArrayIndex = 0;
    const iterator = connections.values();
    for (const connection of iterator) {
      vertices[currentArrayIndex] = connection.from.position.x;
      colors[currentArrayIndex++] = 0.745;
      vertices[currentArrayIndex] = connection.from.position.y;
      colors[currentArrayIndex++] = 0.8;
      vertices[currentArrayIndex] = connection.from.position.z;
      colors[currentArrayIndex++] = 0.823;
      vertices[currentArrayIndex] = connection.to.position.x;
      colors[currentArrayIndex++] = 0.745;
      vertices[currentArrayIndex] = connection.to.position.y;
      colors[currentArrayIndex++] = 0.8;
      vertices[currentArrayIndex] = connection.to.position.z;
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

    const iterator = connections.values();
    for (const connection of iterator) {
      connection.dispose();
    }
    connections.clear();
  }

  return {
    set,
    remove,
    update,
    dispose
  };
}
