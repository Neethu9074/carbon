import { get } from 'lodash';
import React from 'react';

import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import { getTracesCount } from 'in-applications/components/TracesButton';
import connectTo from 'in-hoc/connectTo';

import locals from './Row.mless';

export default connectTo(
  ({ label, value, entityId, getEntity, timeframe, applicationId, serviceId, endpointId }) => {
    const observables = {};
    if (!value) {
      observables.value = getTracesCount({ timeframe, applicationId, serviceId, endpointId });
    }
    if (!label && entityId) {
      observables.label = getEntity({
        id: entityId,
        filter: {
          application: applicationId,
          service: serviceId,
          endpoint: endpointId,
          timeframe
        }
      }).map(result => get(result, ['data', 'label'], null));
    }
    return observables;
  },
  function Row({ label, value, total, iconType, type }) {
    if (!label || !value) {
      return null;
    }

    return (
      <div className={locals.row}>
        <div className={locals.heading}>
          <EntityWithTypeAndIcon label={label} type={type} iconType={iconType} />
          <ValueAndPercentage value={value} total={total} />
        </div>
        <Bar percentage={value / total} />
      </div>
    );
  }
);

function ValueAndPercentage({ value, total }) {
  return (
    <div className={locals.valueAndPercentageWrapper}>
      <span>{value}</span>
      <span className={locals.percentage}>{`(${((value / total * 10000) | 0) / 100}%)`}</span>
    </div>
  );
}

function Bar({ percentage }) {
  return (
    <div className={locals.outerBar}>
      <div style={{ width: `${percentage * 100}%` }} className={locals.innerBar} />
    </div>
  );
}
