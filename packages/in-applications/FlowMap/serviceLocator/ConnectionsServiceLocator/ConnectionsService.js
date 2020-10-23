import { create } from 'reactive-observables';

import fragmentShader from 'in-applications/FlowMap/serviceLocator/ConnectionsServiceLocator/shader/fragmentShader.glsl';
import vertexShader from 'in-applications/FlowMap/serviceLocator/ConnectionsServiceLocator/shader/vertexShader.glsl';

import { getServiceLocators } from 'in-applications/FlowMap/serviceLocator/serviceLocator';
import { LineSegments, BufferGeometry, RawShaderMaterial } from 'in-map/3DLibProvider';
import { createConnectionId } from 'in-applications/FlowMap/sceneObjects/Connection';
import { SIGNALS } from 'in-applications/FlowMap/components/Controls/Controls';
import Connection from 'in-applications/FlowMap/sceneObjects/Connection';
import { updateAttribute } from 'in-map/services/geometryAttributes';
import { neutralColorRgb } from 'in-services/heatMapColors';
import Subscriber from 'in-map/misc/Subscriber';
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

  let metricUsedForColorCalculation = null;
  const colorUpdateSignal$ = create();

  const subscriber = new Subscriber();
  let colorUpdateSubscription = null;
  subscriber.addSubscription(
    getServiceLocators(serviceLocatorUid)
      .eventBusServiceLocator.on(SIGNALS.HEATMAP)
      .subscribe(heatMapSignal => {
        metricUsedForColorCalculation = heatMapSignal;

        if (heatMapSignal) {
          if (!colorUpdateSubscription) {
            colorUpdateSubscription = colorUpdateSignal$.nextFrame().subscribe(updateShaderInformation);
          }
        } else {
          if (colorUpdateSubscription) {
            updateShaderInformation();
            colorUpdateSubscription.dispose();
            colorUpdateSubscription = null;
          }
        }
        requestConnectionColorUpdate();
      })
  );

  const instance = {
    requestConnectionColorUpdate,
    remove,
    update,
    dispose
  };
  return instance;

  function setConnections(nextConnectionConfigs) {
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
        new Connection(
          serviceLocatorUid,
          connectionConfig.from,
          connectionConfig.to,
          connectionConfig.direction,
          instance
        )
      );
    }
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

  function requestConnectionColorUpdate() {
    colorUpdateSignal$.emit(true);
  }

  function updateAllConnectionPositions() {
    const iterator = connections.values();
    for (const connection of iterator) {
      connection.updatePosition();
    }
  }

  function updateShaderInformation() {
    updateVertices();
    updateColors();
  }

  function updateGeometry() {
    updateShaderInformation();

    getServiceLocators(serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .addSceneObject(line);
  }

  function updateVertices() {
    const vertices = [];
    let currentArrayIndex = 0;
    const iterator = connections.values();
    for (const connection of iterator) {
      vertices[currentArrayIndex++] = connection.from.position.x;
      vertices[currentArrayIndex++] = connection.from.position.y;
      vertices[currentArrayIndex++] = connection.from.position.z;
      vertices[currentArrayIndex++] = connection.to.position.x;
      vertices[currentArrayIndex++] = connection.to.position.y;
      vertices[currentArrayIndex++] = connection.to.position.z;
    }
    updateAttribute(geometry, 'position', vertices);
  }

  function updateColors() {
    const colors = [];
    let items = connections.values();

    let currentArrayIndex = 0;
    items = connections.values();
    for (const connection of items) {
      let color = neutralColorRgb;
      if (metricUsedForColorCalculation) {
        if (connection.getDirection() === 'outgoing') {
          color = connection.to.getHeatMapColor();
        } else {
          color = connection.from.getHeatMapColor();
        }
      }

      colors[currentArrayIndex++] = color.r;
      colors[currentArrayIndex++] = color.g;
      colors[currentArrayIndex++] = color.b;
      colors[currentArrayIndex++] = color.r;
      colors[currentArrayIndex++] = color.g;
      colors[currentArrayIndex++] = color.b;
    }
    updateAttribute(geometry, 'color', colors);

    getServiceLocators(serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .requestRendering();
  }

  function update(nodesMap) {
    const nodes = nodesMap.objects.values();
    const connections = [];
    for (const node of nodes) {
      for (let i = 0; i < node.incoming.length; i++) {
        createConnectionsForNodes(node.incoming[i], node, connections, 'incoming');
      }
      for (let i = 0; i < node.outgoing.length; i++) {
        createConnectionsForNodes(node, node.outgoing[i], connections, 'outgoing');
      }
    }
    setConnections(connections);
    updateGeometry();
  }

  function createConnectionsForNodes(from, to, connections, direction) {
    const initialPxUnitRation = getServiceLocators(serviceLocatorUid).sceneServiceLocator.getScene()
      .initialPxUnitRation;

    const initialNodeSizeInPx = getServiceLocators(serviceLocatorUid).sceneServiceLocator.getScene()
      .initialNodeSizeInPx;

    const xOffset = (initialNodeSizeInPx * initialPxUnitRation) / 2;

    if (from.children.size === 0 && to.children.size === 0) {
      connections.push(getConnection(from, to, xOffset, 0, direction));
      return;
    } else if (from.children.size > 0 && to.children.size > 0) {
      connectChildren(from, xOffset, connections);
      connectChildren(to, xOffset, connections);
    }
  }

  function connectChildren(node, xOffset, connections) {
    const yOffset = 0;
    const yOffsetStep = 2.02;
    let iFrom = 0;

    for (const fromChild of node.children.values()) {
      const cSource = fromChild;
      let sourcePos = cSource.parentNode.position.clone();
      sourcePos.x -= xOffset;
      sourcePos.y -= yOffset + iFrom * yOffsetStep;
      iFrom++;

      for (let i = 0; i < fromChild.incoming.length; i++) {
        const cFrom = fromChild.incoming[i];
        const fromPos = cFrom.parentNode.position.clone();
        const iChild = indexOf(cFrom, fromChild.incoming[i].parentNode.children);

        if (!cFrom.parentNode.isRemainingNodesPlaceHolder) {
          fromPos.y -= iChild * yOffsetStep;
        }
        fromPos.x += xOffset;
        connections.push(getChildConnection(cFrom, cSource, fromPos, sourcePos, 'incoming'));
      }

      sourcePos = sourcePos.clone();
      sourcePos.x += 2 * xOffset;
      for (let i = 0; i < fromChild.outgoing.length; i++) {
        const cTo = fromChild.outgoing[i];
        const toPos = cTo.parentNode.position.clone();
        const iChild = indexOf(cTo, fromChild.outgoing[i].parentNode.children);

        if (!cTo.parentNode.isRemainingNodesPlaceHolder) {
          toPos.y -= iChild * yOffsetStep;
        }
        toPos.x -= xOffset;
        connections.push(getChildConnection(cSource, cTo, sourcePos, toPos, 'outgoing'));
      }
    }
  }

  function getChildConnection(from, to, fromPos, toPos, direction) {
    const config = getConnectionConfig(from, to, fromPos, toPos, direction);
    config.id = createConnectionId(
      { id: `${from.parentNode.id}_${from.id}` },
      { id: `${from.parentNode.id}_${to.id}` }
    );
    return config;
  }

  function getConnection(from, to, xOffset, yOffset, direction) {
    const fromPos = from.position.clone();
    fromPos.x += xOffset;
    fromPos.y += yOffset;

    const toPos = to.position.clone();
    toPos.x -= xOffset;
    toPos.y += yOffset;

    const config = getConnectionConfig(from, to, fromPos, toPos, direction);
    config.id = createConnectionId(config.from, config.to);
    return config;
  }

  function getConnectionConfig(from, to, fromPos, toPos, direction) {
    return {
      direction,
      from: {
        id: from.id,
        position: fromPos,
        events$: from.events$,
        getHeatMapColor: () => from.getHeatMapColor()
      },
      to: {
        id: to.id,
        position: toPos,
        events$: to.events$,
        getHeatMapColor: () => to.getHeatMapColor()
      }
    };
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
    if (colorUpdateSubscription) {
      colorUpdateSubscription.dispose();
      colorUpdateSubscription = null;
    }
    subscriber.dispose();

    getServiceLocators(serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .removeSceneObject(line);

    const iterator = connections.values();
    for (const connection of iterator) {
      connection.dispose();
    }
    connections.clear();
  }
}
