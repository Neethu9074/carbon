import { combineLatest, create } from 'reactive-observables';
import RoEmitter from 'roemitter';

import fragmentShader from 'in-applications/ApplicationMap/serviceLocator/ConnectionsServiceLocator/shader/fragmentShader.glsl';
import vertexShader from 'in-applications/ApplicationMap/serviceLocator/ConnectionsServiceLocator/shader/vertexShader.glsl';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import { createConnectionId } from 'in-applications/ApplicationMap/sceneObjects/Connection';
import { LineSegments, BufferGeometry, RawShaderMaterial } from 'in-map/3DLibProvider';
import Connection from 'in-applications/ApplicationMap/sceneObjects/Connection';
import { updateAttribute } from 'in-map/services/geometryAttributes';
import Subscriber from 'in-map/misc/Subscriber';
import { diff } from 'in-services/arrayUtils';

export default function createConnectionsService(serviceLocatorUid, eventBusServiceLocator) {
  const connections = new Map();
  const connections$ = create();
  const events$ = new RoEmitter();

  const geometry = new BufferGeometry();

  const material = new RawShaderMaterial({
    transparent: true,
    depthWrite: false,
    fragmentShader: fragmentShader,
    vertexShader: vertexShader
  });
  material.linewidth = 2;

  const line = new LineSegments(geometry, material);
  line.frustumCulled = false;

  const subscriber = new Subscriber();

  const instance = {
    initSubscriptions,
    getConnections,
    getConnections$,
    update,
    updateAllConnectionPositions,
    dispose
  };
  return instance;

  function initSubscriptions(hiddenEntitiesServiceLocator) {
    subscriber.addSubscriptions([
      combineLatest([
        hiddenEntitiesServiceLocator.getResolvedId$(),
        eventBusServiceLocator.on(SIGNALS.WORLD_UNITS).distinct((a, b) => a.aspectRatio !== b.aspectRatio),
        events$.on('updateVerticesAndOpacity')
      ]).subscribe(([hiddenIds]) => updateVerticesAndOpacity(hiddenIds))
    ]);
  }

  function getConnections() {
    return connections;
  }

  function getConnections$() {
    return connections$;
  }

  function update(nodesMap) {
    const nodes = nodesMap.objects.values();
    const connections = [];
    for (const node of nodes) {
      for (let i = 0; i < node.incoming.length; i++) {
        const connection = node.incoming[i];
        createConnectionsForNodes(connection, connections, nodesMap);
      }
    }
    setConnections(connections);
  }

  function createConnectionsForNodes(connection, connections, nodesMap) {
    connections.push(getConnection(connection, nodesMap));
  }

  function getConnection(connection, nodesMap) {
    const from = nodesMap.get(connection.from);
    const to = nodesMap.get(connection.to);

    const config = getConnectionConfig(connection, from, to);
    config.id = createConnectionId(config.from.id, config.to.id);
    return config;
  }

  function getConnectionConfig(connection, from, to) {
    return {
      from: {
        id: connection.from,
        events$: from.events$,
        node: from
      },
      to: {
        id: connection.to,
        events$: to.events$,
        node: to
      },
      data: connection
    };
  }

  function setConnections(nextConnectionConfigs) {
    const difference = diff(
      Array.from(connections.keys()),
      nextConnectionConfigs.map(config => config.id)
    );

    remove(difference.uniqueItemsA);
    add(nextConnectionConfigs);

    connections$.emit(connections);
  }

  function remove(ids) {
    for (let i = 0; i < ids.length; i++) {
      const idToDelete = ids[i];
      const connection = connections.get(idToDelete);
      if (connection) {
        connection.dispose();
        connections.delete(idToDelete);
      }
    }
  }

  function add(newItems) {
    for (let i = 0; i < newItems.length; i++) {
      const connectionConfig = newItems[i];
      if (connections.has(connectionConfig.id)) {
        const existingConnection = connections.get(connectionConfig.id);
        existingConnection.setFromAndTo(connectionConfig.from, connectionConfig.to);
        existingConnection.setData(connectionConfig.data);
        continue;
      }

      const newConnection = new Connection(serviceLocatorUid, connectionConfig.from, connectionConfig.to, instance);
      newConnection.setData(connectionConfig.data);
      connections.set(connectionConfig.id, newConnection);
    }
  }

  function updateAllConnectionPositions() {
    const iterator = connections.values();
    for (const connection of iterator) {
      connection.updatePosition();
    }
    updateGeometry();
  }

  function updateGeometry() {
    events$.emit('updateVerticesAndOpacity', true);
  }

  function updateVerticesAndOpacity(hiddenIds) {
    const vertices = [];
    const opacities = [];

    let verticesArrayIndex = 0;
    let opacityArrayIndex = 0;
    const iterator = connections.values();
    for (const connection of iterator) {
      const { from, to } = connection;

      vertices[verticesArrayIndex++] = from.node.position.x;
      vertices[verticesArrayIndex++] = from.node.position.y;
      vertices[verticesArrayIndex++] = 0;
      vertices[verticesArrayIndex++] = to.node.position.x;
      vertices[verticesArrayIndex++] = to.node.position.y;
      vertices[verticesArrayIndex++] = 0;

      let opacity;
      if (hiddenIds && hiddenIds.size > 0 && (hiddenIds.has(connection.from.id) || hiddenIds.has(connection.to.id))) {
        opacity = 0.05;
        connection.setParticlesOpacity(0);
      } else {
        opacity = 0.3;
        connection.setParticlesOpacity(0.5);
      }

      opacities[opacityArrayIndex++] = opacity;
      opacities[opacityArrayIndex++] = opacity;
    }

    updateAttribute(geometry, 'position', vertices);
    updateAttribute(geometry, 'opacity', opacities, 1);

    const scene = getServiceLocators(serviceLocatorUid).sceneServiceLocator.getScene();
    if (vertices.length === 0) {
      scene.removeSceneObject(line);
    } else {
      scene.addSceneObject(line);
    }

    scene.requestRendering();
  }

  function dispose() {
    subscriber.dispose();

    getServiceLocators(serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .removeSceneObject(line);

    material.dispose();
    geometry.dispose();

    const iterator = connections.values();
    for (const connection of iterator) {
      connection.dispose();
    }
    connections.clear();
  }
}
