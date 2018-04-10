import { get } from 'lodash';
import React from 'react';

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

    const linkToAnalyze =
      analyzeEnabled && (applicationId || serviceId || endpointId)
        ? getLinkToAnalyze({ applicationId, serviceId, endpointId })
        : null;
    return (
      <div className={locals.row}>
        <div className={locals.heading}>
          <EntityWithTypeAndIcon label={label} type={type} iconType={iconType} />
          <ValueAndPercentage href$={linkToAnalyze} value={value} total={total} />
        </div>
        <Bar percentage={value / total} />
      </div>
    );
  }
);

function ValueAndPercentage({ value, total, href$ }) {
  const renderedValue = value == null ? '––' : number.compact(value);
  const LinkOrSpan = href$ ? Link : 'span';
  return (
    <div className={locals.valueAndPercentageWrapper}>
      <LinkOrSpan href$={href$}>{renderedValue}</LinkOrSpan>
      <LinkOrSpan href$={href$} className={locals.percentage}>
        {value != null && total != null && `(${percentage.detailed(value / total)})`}
      </LinkOrSpan>
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
