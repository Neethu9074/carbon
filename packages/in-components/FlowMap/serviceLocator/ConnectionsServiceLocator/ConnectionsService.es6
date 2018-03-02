import fragmentShader from 'in-components/FlowMap/serviceLocator/ConnectionsServiceLocator/shader/fragmentShader.glsl';
import vertexShader from 'in-components/FlowMap/serviceLocator/ConnectionsServiceLocator/shader/vertexShader.glsl';

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

  function setConnections(nextConnectionConfigs) {
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
        const existingConnection = connections.get(connectionConfig.id);
        existingConnection.setFromAndTo(connectionConfig.from, connectionConfig.to);
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

  function updateVertices() {
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

  function update(nodesMap) {
    const nodes = nodesMap.objects.values();
    const connections = [];
    for (const node of nodes) {
      for (let i = 0; i < node.incoming.length; i++) {
        createConnectionsForNodes(node.incoming[i], node, connections);
      }
      for (let i = 0; i < node.outgoing.length; i++) {
        createConnectionsForNodes(node, node.outgoing[i], connections);
      }
    }
    setConnections(connections);
    updateVertices();
  }

  function createConnectionsForNodes(from, to, connections) {
    const initialPxUnitRation = getServiceLocators(serviceLocatorUid).sceneServiceLocator.getScene()
      .initialPxUnitRation;

    const initialNodeSizeInPx = 199.2;
    const xOffset = initialNodeSizeInPx * initialPxUnitRation / 2;
    const yOffset = 1.4;
    const yOffsetStep = 0.575;
    if (from.children.size === 0 && to.children.size === 0) {
      connections.push({ from, to });
    } else if (from.children.size > 0 && to.children.size > 0) {
      let iFrom = 0;
      for (const fromChild of from.children.values()) {
        const cSource = fromChild;
        let sourcePos = cSource.parentNode.position.clone();
        sourcePos.x -= xOffset;
        sourcePos.y -= yOffset + iFrom * yOffsetStep;
        iFrom++;

        for (let i = 0; i < fromChild.incoming.length; i++) {
          const cFrom = fromChild.incoming[i];
          const fromPos = cFrom.parentNode.position.clone();
          const iChild = indexOf(cFrom, fromChild.incoming[i].parentNode.children);
          fromPos.y -= yOffset + iChild * yOffsetStep;
          fromPos.x += xOffset;
          connections.push({
            from: {
              id: cFrom.id,
              position: fromPos,
              events$: cFrom.events$
            },
            to: {
              id: cSource.id,
              position: sourcePos,
              events$: cSource.events$
            }
          });
        }

        sourcePos = sourcePos.clone();
        sourcePos.x += 2 * xOffset;
        for (let i = 0; i < fromChild.outgoing.length; i++) {
          const cTo = fromChild.outgoing[i];
          const iChild = indexOf(cTo, fromChild.outgoing[i].parentNode.children);
          const toPos = cTo.parentNode.position.clone();
          toPos.y -= yOffset + iChild * yOffsetStep;
          toPos.x -= xOffset;

          connections.push({
            from: {
              id: cSource.id,
              position: sourcePos,
              events$: cSource.events$
            },
            to: {
              id: cTo.id,
              position: toPos,
              events$: cTo.events$
            }
          });
        }
      }
    }
  }

  function indexOf(childToFind, children) {
    let i = 0;
    for (const child of children.values()) {
      if (child.id === childToFind.id) {
        return i;
      }
      i++;
    }
    return 0;
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
    remove,
    update,
    dispose
  };
}
