import { combineLatest } from 'reactive-observables';
import React from 'react';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import MediumContent from 'in-components/FlowMap/components/Node/MediumContent';
import ExpandButton from 'in-components/FlowMap/components/Node/ExpandButton';
import SmallContent from 'in-components/FlowMap/components/Node/SmallContent';
import Children from 'in-components/FlowMap/components/Node/Children';
import { evaluateClassNames } from 'in-services/util/classnames';
import { applyTransform } from 'in-services/util/dom';
import Subscriber from 'in-map/misc/Subscriber';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import locals from './Node.mless';

export default connectTo(
  props => ({
    data: props.node.events$.on('data'),
    metrics: props.node.events$.on('metricValues'),
    childList: props.node.events$.on('children'),
    heatMapColor: props.node.events$.on('heatMapColor')
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
      const { node, metrics, data, size, heatMapColor, isRootNode, serviceLocatorUid, childList } = this.props;
      const label = data ? data.label : '';

      return (
        <Tooltip content={size !== 'mid' ? label : null}>
          <div
            style={{
              border:
                heatMapColor &&
                `1px solid rgb(${(heatMapColor.r * 255) | 0}, ${(heatMapColor.g * 255) | 0}, ${(heatMapColor.b * 255) |
                  0})`
            }}
            ref={nodeDomComponent => (this.nodeDomComponent = nodeDomComponent)}
            className={evaluateClassNames({
              [locals.node]: true,
              [locals[size]]: true,
              [locals.selected]: isRootNode
            })}
          >
            {isRootNode && size !== 'xs' && <div className={locals.rootLabel}>In Focus</div>}

            {getContent(metrics, data, size, serviceLocatorUid)}

            {!childList && (
              <ExpandButton direction="incoming" events$={node.events$} onClick={() => node.expandLeft()} />
            )}
            {!childList && (
              <ExpandButton direction="outgoing" events$={node.events$} onClick={() => node.expandRight()} />
            )}

            <Children childList={childList} />
          </div>
        </Tooltip>
      );
    }
  }
);

function getContent(metrics, data, size, serviceLocatorUid) {
  if (size === 'mid') {
    return <MediumContent metrics={metrics} data={data} serviceLocatorUid={serviceLocatorUid} />;
  }
  return <SmallContent data={data} />;
}
