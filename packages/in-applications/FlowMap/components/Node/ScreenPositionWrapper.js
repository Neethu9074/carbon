import { combineLatest } from 'reactive-observables';
import React from 'react';

import { getServiceLocators } from 'in-applications/FlowMap/serviceLocator/serviceLocator';
import { applyTransform } from 'in-services/util/dom';
import Subscriber from 'in-map/misc/Subscriber';

import locals from './Node.mless';

export default class extends React.Component {
  static displayName = 'ScreenPositionWrapper';

  subscriber = new Subscriber();

  componentDidMount() {
    this.subscriber.addSubscription(
      combineLatest([
        this.props.node.events$.on('screenPosition').startWith(null),
        getServiceLocators(this.props.serviceLocatorUid).eventBusServiceLocator.on('worldUnits')
      ]).subscribe(([screenPosition, worldUnits]) => {
        if (!screenPosition) {
          this.nodeDomComponent.style.display = 'none';
          return;
        }
        this.nodeDomComponent.style.display = '';

        applyTransform(
          this.nodeDomComponent,
          `translate3d(${screenPosition.x}px,${screenPosition.y}px,0) scale(${worldUnits.targetNodeSizeInPx / 250})`
        );
      })
    );
  }

  componentWillUnmount() {
    this.subscriber.dispose();
    this.subscriber = null;
  }

  render() {
    return (
      <div className={locals.node} ref={nodeDomComponent => (this.nodeDomComponent = nodeDomComponent)}>
        {this.props.children}
      </div>
    );
  }
}
