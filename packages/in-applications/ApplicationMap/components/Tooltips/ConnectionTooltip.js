/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import ApplicationMapTootlip from 'in-applications/ApplicationMap/components/Tooltips/ApplicationMapTootlip';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import { number, percentage, meanLatency } from 'in-services/formatters/number';
import { t } from 'in-i18n';

import locals from './ConnectionTooltip.mless';

export default function ConnectionTooltipMounter({ serviceLocatorUid }) {
  const connectionServiceLocator = getServiceLocators(serviceLocatorUid).hoveredConncetionsServiceLocator;
  const highlightedConnectionResult = useObservable(
    connectionServiceLocator.getHoveredConnection$(),
    [],
    { pure: false } // immediate state update to ensure tooltip is shown
  );
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
      <ConnectionTooltipContent connection={highlightedConnectionResult.connection} />
    </div>
  );
}

export function ConnectionTooltipContent({ connection }) {
  const data = useObservable(connection.events$.on('data'), []);
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
