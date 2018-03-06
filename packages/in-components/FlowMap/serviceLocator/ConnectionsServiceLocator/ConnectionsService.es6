import { create } from 'reactive-observables';

import fragmentShader from 'in-components/FlowMap/serviceLocator/ConnectionsServiceLocator/shader/fragmentShader.glsl';
import vertexShader from 'in-components/FlowMap/serviceLocator/ConnectionsServiceLocator/shader/vertexShader.glsl';

import { DEFAULT_COLOR } from 'in-components/FlowMap/serviceLocator/ConnectionsServiceLocator/connectionColors';
import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import { LineSegments, BufferGeometry, RawShaderMaterial } from 'in-map/3DLibProvider';
import { createConnectionId } from 'in-components/FlowMap/sceneObjects/Connection';
import { SIGNALS } from 'in-components/FlowMap/components/Controls/Controls';
import Connection from 'in-components/FlowMap/sceneObjects/Connection';
import { updateAttribute } from 'in-map/services/geometryAttributes';
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
            colorUpdateSubscription = colorUpdateSignal$.nextFrame().subscribe(() => updateColors());
          }
        } else {
          if (colorUpdateSubscription) {
            updateColors();
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
      const connection = connections.get(ids[i]);
      if (connection) {
        connection.dispose();
        connections.delete(connection.id);
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

  function updateGeometry() {
    updateVertices();
    updateColors();

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
      let color = DEFAULT_COLOR;
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

    const xOffset = initialNodeSizeInPx * initialPxUnitRation / 2;
    const yOffset = 1.4;
    const yOffsetStep = 0.575;
    if (from.children.size === 0 && to.children.size === 0) {
      connections.push(getConnection(from, to, xOffset, 0, direction));
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
          const iChild = indexOf(cFrom, fromChild.incoming[i].parentNode.children);
          connections.push(getConnection(cFrom, cSource, xOffset, yOffset + iChild * yOffsetStep, direction));
        }

        sourcePos = sourcePos.clone();
        sourcePos.x += 2 * xOffset;
        for (let i = 0; i < fromChild.outgoing.length; i++) {
          const cTo = fromChild.outgoing[i];
          const iChild = indexOf(cTo, fromChild.outgoing[i].parentNode.children);
          connections.push(getConnection(cSource, cTo, xOffset, yOffset + iChild * yOffsetStep, direction));
        }
      }
    }
  }

  function getConnection(from, to, xOffset, yOffset, direction) {
    const fromPos = from.position.clone();
    fromPos.x += xOffset;
    fromPos.x += yOffset;
    const toPos = to.position.clone();
    toPos.x -= xOffset;
    toPos.x += yOffset;

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
