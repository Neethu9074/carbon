/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { createRef } from 'react';

/* eslint-disable react/no-find-dom-node */
import { combineLatest } from '@instana/observables';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import { applyTransform } from 'in-services/util/dom';
import Subscriber from 'in-map/misc/Subscriber';

export default function performantNodeManipulationWrapper(ComposedComponent) {
  return class extends React.Component {
    static displayName = 'PerformantNodeManipulationWrapper';

    subscriber = new Subscriber();
    state = {
      power: null,
      metric: null
    };

    constructor() {
      super();

      this.nodeRef = createRef();
    }

    componentDidMount() {
      const { serviceLocatorUid, node } = this.props;
      const eventBusServiceLocator = getServiceLocators(serviceLocatorUid).eventBusServiceLocator;
      const nodeDomComponent = this.nodeRef.current;

      this.subscriber.addSubscriptions([
        combineLatest([
          node.events$.on('screenPosition').startWith(null),
          eventBusServiceLocator.on(SIGNALS.WORLD_UNITS)
        ]).subscribe(([screenPosition, worldUnits]) => {
          if (!screenPosition) {
            nodeDomComponent.style.display = 'none';
            return;
          }
          nodeDomComponent.style.display = '';

          applyTransform(
            nodeDomComponent,
            `translate3d(${screenPosition.x}px,${screenPosition.y}px,0) scale3d(${worldUnits.targetNodeSizeInRelationToInitSize}, ${worldUnits.targetNodeSizeInRelationToInitSize}, 1)`
          );
        }),

        getServiceLocators(serviceLocatorUid)
          .hiddenEntitiesServiceLocator.getResolvedId$()
          .map(hiddenEntityIds => (hiddenEntityIds ? hiddenEntityIds.has(node.id) : false))
          .distinct()
          .subscribe(isHidden => (nodeDomComponent.style.opacity = isHidden ? 0.15 : 1.0)),

        combineLatest([
          eventBusServiceLocator.on(SIGNALS.POWER_FUNCTIONS),
          eventBusServiceLocator.on(SIGNALS.SIZING_METRIC)
        ]).subscribe(([powerFunctions, sizeMetric]) => {
          const power = powerFunctions.getPowerByName(node.id, sizeMetric, 0);
          if (this.state.power !== power) {
            this.setState({ power });
          }
        })
      ]);
    }

    componentWillUnmount() {
      this.subscriber.dispose();
      this.subscriber = null;
    }

    render() {
      return (
        <ComposedComponent {...this.props} metric={this.state.metric} power={this.state.power} ref={this.nodeRef} />
      );
    }
  };
}
