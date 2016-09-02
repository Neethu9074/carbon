import React from 'react';

import ConnectionComponent from 'in-map/components/physical/ConnectionComponent';
import NodeMetricComponent from 'in-map/components/physical/NodeMetricComponent';
import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import LayerComponent from 'in-map/components/physical/LayerComponent';
import {nodes} from 'in-map/stores/physical/nodesStore';
import Node from 'in-map/sceneObjects/physical/Node';
import {emptyArray} from 'in-services/fixedObjects';
import {activeMetric$} from 'in-stores/metric';
import connectTo from 'in-hoc/connectTo';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Node,
    params: {
      id: props.entity.get('id'),
      entity: props.entity,
      group: props.group,
      webVRMode: props.webVRMode
    }
  };
},
connectTo(props => {
  return {
    isHighlighted: props.sceneObject.eventEmitter.on('isHighlighted'),
    activeMetric: activeMetric$
  };
}, NodeComponent)
);

function NodeComponent({entity, activeMetric, includedIds, sceneObject, isHighlighted}) {
  const layer = [];
  entity.get('children').forEach(layerEntity => {
    const layerId = layerEntity.get('id');
    if (includedIds.layerIds[layerId]) {
      layer.push(layerEntity);
    }
  });

  return (
    <div>
      {!activeMetric
        ? layer.map(layerEntity => <LayerComponent key={layerEntity.get('id')}
                                                   node={sceneObject}
                                                   entity={layerEntity} />)
        : <Metric node={sceneObject} />
      }
      {isHighlighted ? <Connections entity={entity} /> : null}
    </div>
  );
}

const Metric = connectTo(props => {
  return {
    isVisibleForMetrics: props.node.eventEmitter.on('isVisibleForMetrics')
  };
},
function Metric({node, isVisibleForMetrics}) {
  if (!isVisibleForMetrics) {
    return null;
  }

  return (
    <NodeMetricComponent node={node} />
  );
});

function Connections({entity}) {
  const nodeEntityId = entity.get('id');
  const outgoing = entity.get('outgoingConnections', emptyArray);
  const incoming = entity.get('incomingConnections', emptyArray);

  return (
    <ul>
      {outgoing.map(connectionEntity => <ConnectionSpawner key={connectionEntity.get('id')}
                                                           sourceId={nodeEntityId}
                                                           destinationId={connectionEntity.get('otherId')}
                                                           entity={connectionEntity} />
      )}
      {incoming.map(connectionEntity => <ConnectionSpawner key={connectionEntity.get('id')}
                                                           sourceId={connectionEntity.get('otherId')}
                                                           destinationId={nodeEntityId}
                                                           entity={connectionEntity} />
      )}
    </ul>
  );
}

const ConnectionSpawner = connectTo(() => {
  return {
    _nodes: nodes.stream
  };
}, function ConnectionSpawner({_nodes, sourceId, destinationId, entity}) {
  if (!_nodes) {
    return null;
  }

  const sourceNode = _nodes[sourceId];
  const destinationNode = _nodes[destinationId];
  if (!sourceNode || !destinationNode) {
    return null;
  }

  return (
    <ConnectionComponent entity={entity}
                         sourceNode={sourceNode}
                         destinationNode={destinationNode} />
  );
});
