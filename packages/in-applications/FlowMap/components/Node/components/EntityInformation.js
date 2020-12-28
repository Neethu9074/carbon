import classNames from 'classnames';
import React from 'react';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HeatMapIndicator from 'in-applications/FlowMap/components/Node/components/HeatMapIndicator';
import ExpandButton from 'in-applications/FlowMap/components/Node/components/ExpandButton';
import Metrics from 'in-applications/FlowMap/components/Node/components/Metrics';
import connectTo from 'in-hoc/connectTo';

import locals from './EntityInformation.mless';

export default connectTo(
  props => ({
    heatMapColor: props.entity.events$.on('heatMapColor'),
    data: props.entity.events$.on('data')
  }),
  function EntityInformation(props) {
    const { data, heatMapColor, isRootNode, entity, expandLeft, expandRight, Link } = props;

    return (
      <div className={locals.wrapper}>
        <Metrics {...props} />
        <div
          className={classNames({
            [locals.entityInformation]: true,
            [locals.heatMapEnabled]: heatMapColor,
            [locals.rootEntity]: isRootNode
          })}
        >
          <HeatMapIndicator {...props} />

          <Link className={locals.entityLink} serviceId={data.id} {...props}>
            {data.label}
          </Link>

          <EndpointTypeBadgeList type={data.type} types={data.types} />

          <ExpandButton direction="incoming" events$={entity.events$} onClick={() => expandLeft(entity.id)} />
          <ExpandButton direction="outgoing" events$={entity.events$} onClick={() => expandRight(entity.id)} />
        </div>
      </div>
    );
  }
);
