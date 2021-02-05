/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';
import { t } from 'in-i18n';
import React from 'react';

import ApplicationMapTootlip from 'in-applications/ApplicationMap/components/Tooltips/ApplicationMapTootlip';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import { number, percentage, meanLatency } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './ConnectionTooltip.mless';

export default connectTo(
  ({ serviceLocatorUid }) => ({
    highlightedConnectionResult: getServiceLocators(
      serviceLocatorUid
    ).hoveredConncetionsServiceLocator.getHoveredConnection$()
  }),
  function ConnectionTooltipMounter({ highlightedConnectionResult }) {
    if (
      !highlightedConnectionResult ||
      !highlightedConnectionResult.enabled ||
      (highlightedConnectionResult.screenHitPosition.x === 0 && highlightedConnectionResult.screenHitPosition === 0)
    ) {
      return null;
    }

    return (
      <div
        style={{
          left: highlightedConnectionResult.screenHitPosition.x + 10,
          top: highlightedConnectionResult.screenHitPosition.y
        }}
        className={locals.connectionTooltipMounter}
      >
        <ConnectionTooltip connection={highlightedConnectionResult.connection} />
      </div>
    );
  }
);

const ConnectionTooltip = connectTo(
  props => ({
    data: props.connection.events$.on('data')
  }),
  ConnectionTooltipContent
);

export function ConnectionTooltipContent({ connection, data }) {
  return (
    <ApplicationMapTootlip
      renderHeader={() => (
        <div className={locals.flexWrapper}>
          <SvgIcon className={locals.icon} type="lib_application_connection" size="s" />
          <div className={locals.labelFlexWrapper}>
            <span className={locals.label}>{get(connection, ['from', 'node', 'data', 'label'])}</span>
            <span className={locals.label}>{get(connection, ['to', 'node', 'data', 'label'])}</span>
          </div>
        </div>
      )}
      renderContent={() => renderContent(data)}
    />
  );
}

function renderContent(data) {
  if (!data) {
    return null;
  }
  return (
    <div className={locals.metrics}>
      <MetricValue title={t('in-applications:titleTotalCalls')} metric={data.calls} tooltipFormatter={number.compact} />
      <MetricValue
        title={t('in-applications:titleErroneousCalls')}
        metric={data.errorRate}
        tooltipFormatter={percentage.compact}
      />
      <MetricValue
        title={t('in-applications:titleAvgLatency')}
        metric={data.latency}
        tooltipFormatter={meanLatency.detailed}
      />
    </div>
  );
}

function MetricValue(props) {
  const { metric, tooltipFormatter, title } = props;
  return (
    <div>
      <h3 className={locals.metricLabel}>{title}</h3>
      {tooltipFormatter(metric)}
    </div>
  );
}
