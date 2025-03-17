/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { useObservable } from '@instana/hooks';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HeatMapIndicator from 'in-applications/FlowMap/components/Node/components/HeatMapIndicator';
import ExpandButton from 'in-applications/FlowMap/components/Node/components/ExpandButton';
import Metrics from 'in-applications/FlowMap/components/Node/components/Metrics';

import locals from 'in-applications/FlowMap/components/Node/components/EntityInformation.mless';

export default function EntityInformation(props) {
  const { isRootNode, entity, expandLeft, expandRight, Link } = props;
  const heatMapColor = useObservable(entity.events$.on('heatMapColor'), [entity]);
  const data = useObservable(entity.events$.on('data'), [entity]) ?? {};
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
        <HeatMapIndicator heatMapColor={heatMapColor} />

        <Link className={locals.entityLink} serviceId={data.id} data={data} {...props}>
          {data.label}
        </Link>

        <EndpointTypeBadgeList type={data.type} types={data.types} limit={1} />

        <ExpandButton direction="incoming" events$={entity.events$} onClick={() => expandLeft(entity.id)} />
        <ExpandButton direction="outgoing" events$={entity.events$} onClick={() => expandRight(entity.id)} />
      </div>
    </div>
  );
}
