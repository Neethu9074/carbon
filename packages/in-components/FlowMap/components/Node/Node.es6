import { combineLatest } from 'reactive-observables';
import React from 'react';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import EndpointContent from 'in-components/FlowMap/components/Node/EndpointContent';
import ServiceContent from 'in-components/FlowMap/components/Node/ServiceContent';
import { evaluateClassNames } from 'in-services/util/classnames';
import { applyTransform } from 'in-services/util/dom';
import Subscriber from 'in-map/misc/Subscriber';
import connectTo from 'in-hoc/connectTo';

import locals from './Node.mless';

export default connectTo(
  props => ({
    childList: props.node.events$.on('children')
  }),
  class extends React.Component {
    static displayName = 'Node';

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
      const { childList, isRootNode } = this.props;

      return (
        <div
          className={evaluateClassNames({
            [locals.node]: true,
            [locals.selected]: isRootNode
          })}
          ref={nodeDomComponent => (this.nodeDomComponent = nodeDomComponent)}
        >
          {childList ? <EndpointContent childList={childList} {...this.props} /> : <ServiceContent {...this.props} />}
        </div>
      );
    }
  }
);
