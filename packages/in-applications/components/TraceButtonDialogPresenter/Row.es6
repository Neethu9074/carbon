import React, { Fragment } from 'react';
import { get } from 'lodash';

import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import { getTracesCount } from 'in-applications/components/TracesButton';
import { number, percentage } from 'in-services/formatters/number';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { analyzeEnabled } from 'in-services/featureFlags';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

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
  function Row({ label, value, total, iconType, type, applicationId, serviceId, endpointId }) {
    if (!label || value == null) {
      return null;
    }

    const content = (
      <Fragment>
        <div className={locals.heading}>
          <EntityWithTypeAndIcon label={label} type={type} iconType={iconType} />
          <ValueAndPercentage value={value} total={total} />
        </div>
        <Bar percentage={value / total} />
      </Fragment>
    );
    const linkToAnalyze =
      analyzeEnabled && (applicationId || serviceId || endpointId)
        ? getLinkToAnalyze({ applicationId, serviceId, endpointId })
        : null;
    return linkToAnalyze ? (
      <Link className={locals.row} href$={linkToAnalyze}>
        {content}
      </Link>
    ) : (
      <div className={locals.row}>{content}</div>
    );
  }
);

function ValueAndPercentage({ value, total }) {
  const renderedValue = value == null ? '––' : number.compact(value);
  return (
    <div className={locals.valueAndPercentageWrapper}>
      <span>{renderedValue}</span>
      <span className={locals.percentage}>
        {value != null && total != null && `(${percentage.detailed(value / total)})`}
      </span>
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
