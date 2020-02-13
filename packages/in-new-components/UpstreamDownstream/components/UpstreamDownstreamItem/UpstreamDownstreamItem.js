import { get } from 'lodash';
import React from 'react';

import ContextMenu from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamItem/UpstreamDownstreamContextMenu';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { relationships } from 'in-new-components/UpstreamDownstream/constants';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { evaluateClassNames } from 'in-services/util/classnames';
import EntityWithIcon from 'in-new-components/EntityWithIcon';
import Overlay from 'in-new-components/overlays/Overlay';
import { Li } from 'in-new-components/lists/List';
import connectTo from 'in-hoc/connectTo';

import locals from './UpstreamDownstreamItem.mless';

export default connectTo(({ applicationId, serviceId, itemServiceId, endpointId }) => {
  const observables = {};
  if (applicationId) {
    observables.applicationLabel = getApplication({ id: applicationId }).map(getLabel);
  }
  if (itemServiceId) {
    observables.itemServiceLabel = getServiceLabel({ id: itemServiceId }).map(getLabel);
  }
  if (serviceId) {
    observables.serviceLabel = getServiceLabel({ id: serviceId }).map(getLabel);
  }
  if (endpointId) {
    observables.endpointLabel = getEndpointInfo({ id: endpointId }).map(getLabel);
  }
  return observables;
})(function UpstreamDownstreamItem({
  applicationBoundaryScope,
  applicationId,
  applicationLabel,
  area,
  endpointLabel,
  item,
  itemServiceId,
  itemServiceLabel,
  result,
  selectedMetric,
  serviceLabel,
  timeConfig
}) {
  const showTechnologies = false;

  return (
    <Overlay
      content={ContextMenu}
      props={{
        applicationBoundaryScope,
        applicationId,
        applicationLabel,
        area,
        endpointLabel,
        itemServiceId,
        itemServiceLabel,
        serviceLabel
      }}
      align="bottomMiddle"
    >
      {({ toggle, refSetter }) => (
        <Li onClick={itemServiceId === 'ROOT' || itemServiceId === 'UNKNOWN' ? null : toggle} refSetter={refSetter}>
          <div className={locals.itemWrapper}>
            <div className={locals.entityWrapper}>
              <SeverityIndicator severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)} />
              <EntityWithIcon
                icon="lib_application_service"
                label={item.service.label}
                onClick={toggle}
                refSetter={refSetter}
                rootOrUnknown={itemServiceId === 'ROOT' || itemServiceId === 'UNKNOWN'}
                length={25}
              />
            </div>
            <div>
              <EndpointTypeBadgeList types={item.service.types} />
              {showTechnologies && <TechnologyIndicatorList technologies={item.service.technologies} />}
            </div>
            <div className={locals.chartWrapper}>
              <SparkChart
                rollup={getSparkChartGranularity(timeConfig)}
                timeConfig={getResolvedTimeConfig(timeConfig, result)}
                aggregation="SUM"
                metrics={item.metrics.calls}
                metric={item.metrics.callsAgg}
                tooltipFormatter={number.compact}
                label={`${area === relationships.UPSTREAM ? 'Inbound' : 'Outbound'} calls`}
              />
              {selectedMetric === 'latency' ? (
                <SparkChart
                  rollup={getSparkChartGranularity(timeConfig)}
                  timeConfig={getResolvedTimeConfig(timeConfig, result)}
                  aggregation="MEAN"
                  metrics={item.metrics.latency}
                  metric={item.metrics.latencyAgg}
                  tooltipFormatter={meanLatencyFixed.compact}
                  label="Latency"
                />
              ) : (
                <SparkChart
                  rollup={getSparkChartGranularity(timeConfig)}
                  timeConfig={getResolvedTimeConfig(timeConfig, result)}
                  aggregation="SUM"
                  metrics={item.metrics.erroneousCalls}
                  metric={item.metrics.erroneousCallsAgg}
                  tooltipFormatter={number.compact}
                  label="Erroneous Calls"
                  companionMetric={item.metrics.errorsAgg}
                  companionMetricLabel="Erroneous Call Rate: "
                  companionMetricFormatter={percentage.detailed}
                  companionAggregation="MEAN"
                />
              )}
            </div>
          </div>
        </Li>
      )}
    </Overlay>
  );
});

const SeverityIndicator = ({ severity }) => {
  return (
    <div
      className={evaluateClassNames({
        [locals.severity]: true,
        [locals.severityBad]: severity > 5
      })}
    />
  );
};

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
