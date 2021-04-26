/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { useObservable } from '@instana/hooks';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import Node from 'in-applications/ApplicationMap/components/Node/Node';
import usePrevious from 'in-hooks/usePrevious';

export default function Nodes(props) {
  const [preventRendering, setAreventRendering] = useState(false);
  const prevApplicationId = usePrevious(props.applicationId);
  const serviceNodes = useObservable(
    getServiceLocators(props.serviceLocatorUid)
      .nodesServiceLocator.getNodes()
      .stream.debounce(100)
      .map(nodes => {
        if (!nodes || !nodes.size === 0) {
          return null;
        }

        const nodeSceneObjects = nodes.values();
        const nodesArray = [];
        let arrayIndex = 0;
        for (const node of nodeSceneObjects) {
          nodesArray[arrayIndex++] = node;
        }
        return nodesArray;
      }),
    [props.serviceLocatorUid]
  );

  const nodesSize = useObservable(
    getServiceLocators(props.serviceLocatorUid)
      .eventBusServiceLocator.on(SIGNALS.WORLD_UNITS)
      .map(({ targetNodeSizeInRelationToInitSize }) => {
        if (targetNodeSizeInRelationToInitSize < 1) {
          return 'sm';
        }
        return 'mid';
      })
      .distinct(),
    [props.serviceLocatorUid]
  );

  useEffect(() => {
    if (prevApplicationId) {
      setAreventRendering(prevApplicationId !== props.applicationId);
    }
  }, [props.applicationId]);

  if (!serviceNodes || preventRendering) {
    return null;
  }

  return serviceNodes.map(node => <Node key={node.id} node={node} size={nodesSize} {...props} />);
}
