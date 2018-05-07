import React from 'react';

import { getTraceViewFilteredBySnapshotIdAndTimeframe } from 'in-stores/navigation/paths/tracePaths';
import { twoDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { getNumberOfTracesTouchingServiceOrServiceInstance } from 'in-stores/traces';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getChartTimeframeByEvent } from 'in-views/eventView/services/timeframe';
import addSection from 'in-views/eventView/hocs/addSection';
import MetricValue from 'in-components/MetricValue';
import { serverTime$ } from 'in-stores/serverTime';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './EventTraces.less';

const block = 'in-event-details-traces';
const itemClassName = `${block}__item`;

export default addSection(
  connectTo(
    props => {
      const event = props.event;
      const serviceId = event.getIn(['problem', 'snapshotId']);
      const timeConfig = getChartTimeframeByEvent({ event });

      return {
        href: serverTime$
          .map(serverTime => Math.min(serverTime, timeConfig.to))
          .distinct()
          .flatMap(to =>
            getTraceViewFilteredBySnapshotIdAndTimeframe({
              snapshotId: serviceId,
              from: timeConfig.to - timeConfig.windowSize,
              to
            }).nextFrame()
          ),

        numberOfTraces: getNumberOfTracesTouchingServiceOrServiceInstance(serviceId, timeConfig).map(map =>
          map.get('count', 0)
        )
      };
    },
    function EventTraces({ event, href, numberOfTraces }) {
      const serviceId = event.getIn(['problem', 'snapshotId']);
      const timeConfig = getChartTimeframeByEvent({ event });
      const tracesAvailable = numberOfTraces > 0;

      return (
        <DescriptionList className={block}>
          <DescriptionItem
            id="title"
            title={
              tracesAvailable ? (
                <div className={`${block}__title-wrapper`}>
                  <SvgIcon className={`${block}__icon`} type="traces" width={24} color={'#22d8d8'} />
                  {tracesAvailable ? 'Traces Touching' : ''}
                </div>
              ) : null
            }
          >
            {tracesAvailable ? (
              <Button className={`${block}__button`} kind="secondary" size="sm" href={href}>
                View Traces
              </Button>
            ) : null}

            <DescriptionList className={`${block}__metrics`}>
              {tracesAvailable ? (
                <DescriptionItem className={itemClassName} title="Number of traces">
                  {numberOfTraces}
                </DescriptionItem>
              ) : null}

              <DescriptionItem className={itemClassName} title="Avg response time">
                <MetricValue
                  snapshotId={serviceId}
                  metric="duration.mean"
                  formatter={timeByMillisTwoDecimalPlaces}
                  timeWindowAggregation="mean"
                  timeConfig={timeConfig}
                />
              </DescriptionItem>

              <DescriptionItem className={itemClassName} title="Highest response time">
                <MetricValue
                  snapshotId={serviceId}
                  metric="duration.max"
                  formatter={timeByMillisTwoDecimalPlaces}
                  timeWindowAggregation="max"
                  timeConfig={timeConfig}
                />
              </DescriptionItem>

              <DescriptionItem className={itemClassName} title="Avg error count">
                <MetricValue
                  snapshotId={serviceId}
                  metric="error_rate"
                  formatter={twoDecimalPlaces}
                  timeWindowAggregation="mean"
                  timeConfig={timeConfig}
                />
              </DescriptionItem>
            </DescriptionList>
          </DescriptionItem>
        </DescriptionList>
      );
    }
  ),
  isVisible
);

function isVisible(event) {
  return event && event.get('affectedService', null) != null;
}
