import React from 'react';

import ApplicationMapTootlip from 'in-new-components/ApplicationMap/components/Tooltips/ApplicationMapTootlip';
import { getServiceLocators } from 'in-new-components/ApplicationMap/serviceLocator/serviceLocator';
import { number, percentage, millis } from 'in-services/formatters/number';
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
    if (!highlightedConnectionResult) {
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
          <SvgIcon className={locals.icon} type="lib_actions_traffic" width={20} height={20} />
          <div className={locals.labelFlexWrapper}>
            <span className={locals.label}>{connection.from.node.data.label}</span>
            <span className={locals.label}>{connection.to.node.data.label}</span>
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
      <MetricValue title="Total Calls" metric={data.calls} tooltipFormatter={number.compact} />
      <MetricValue title="Error Rate" metric={data.errorRate} tooltipFormatter={percentage.compact} />
      <MetricValue title="Avg. Latency" metric={data.latency} tooltipFormatter={millis.detailed} />
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
