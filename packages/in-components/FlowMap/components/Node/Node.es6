import { combineLatest } from 'reactive-observables';
import React from 'react';

import VerticalTypesIndicator from 'in-components/FlowMap/components/Node/VerticalTypesIndicator';
import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import ExtraSmallContent from 'in-components/FlowMap/components/Node/ExtraSmallContent';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import MediumContent from 'in-components/FlowMap/components/Node/MediumContent';
import SmallContent from 'in-components/FlowMap/components/Node/SmallContent';
import { evaluateClassNames } from 'in-services/util/classnames';
import { applyTransform } from 'in-services/util/dom';
import Subscriber from 'in-map/misc/Subscriber';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './Node.mless';

export default connectTo(
  props => ({
    data: props.node.events$.on('data'),
    metrics: props.node.events$.on('metricValues')
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
      const { node, metrics, data, size, isRootNode, serviceLocatorUid } = this.props;

      return (
        <Tooltip content={size !== 'mid' ? data.label : null}>
          <div
            ref={nodeDomComponent => (this.nodeDomComponent = nodeDomComponent)}
            className={getNodeClasses(isRootNode, size)}
          >
            {isRootNode && size !== 'xs' && <div className={locals.rootLabel}>THIS ENTITY</div>}

            <VerticalTypesIndicator type={data.type} types={data.types} />

            {getContent(metrics, data, size, serviceLocatorUid)}

            <ExpandIcon
              className={locals.expandButtonLeft}
              direction="incoming"
              events$={node.events$}
              onClick={() => node.expandLeft()}
            />
            <ExpandIcon
              className={locals.expandButtonRight}
              direction="outgoing"
              events$={node.events$}
              onClick={() => node.expandRight()}
            />
          </div>
        </Tooltip>
      );
    }
  }
);

const ExpandIcon = connectTo(
  props => ({
    isLoading: props.events$.on(`isLoadingData_${props.direction}`).distinct(),
    isExpanded: props.events$.on(`isExpanded_${props.direction}`).distinct(),
    errors: props.events$.on(`errors_${props.direction}`).distinct()
  }),
  function ExpandIcon({ isLoading, isExpanded, errors, onClick, className }) {
    if (isExpanded) {
      return null;
    }
    const hasErrors = errors && errors.length > 0;
    return (
      <Tooltip content={hasErrors ? <ErroneousResultPresenter errors={errors} /> : null}>
        <div
          className={evaluateClassNames({
            [className]: true,
            [locals.errorneousExpandIcon]: errors && errors.length > 0
          })}
          onClick={onClick}
        >
          <SvgIcon
            type={isLoading ? 'spinner' : 'plus_without_frame'}
            height={isLoading ? 14 : 10}
            color="#ffffff"
            spinning={isLoading}
          />
        </div>
      </Tooltip>
    );
  }
);

function getNodeClasses(isRootNode, size) {
  let classes = `${locals.node} ${locals[size]}`;
  if (isRootNode) {
    return `${classes} ${locals.selected}`;
  }
  return classes;
}

function getContent(metrics, data, size, serviceLocatorUid) {
  if (size === 'mid') {
    return <MediumContent metrics={metrics} data={data} serviceLocatorUid={serviceLocatorUid} />;
  } else if (size === 'sm') {
    return <SmallContent data={data} />;
  }
  return <ExtraSmallContent data={data} />;
}
