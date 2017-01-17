import React from 'react';

import {twoDecimalPlaces, timeByMillisTwoDecimalPlaces} from 'in-services/formatters/number';
import {getTraceViewFilteredBySnapshotIdAndTimeframe} from 'in-stores/navigation/search';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {getNumberOfTracesTouchingService} from 'in-stores/traces';
import addSection from 'in-views/eventView/hocs/addSection';
import MetricValue from 'in-components/MetricValue';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './EventTraces.less';


const block = 'in-event-details-traces';
const itemClassName = `${block}__item`;
const chartOffset = 5 * 60 * 1000; // 5 min

export default addSection(connectTo(props => {
  const event = props.event;
  const serviceId = event.getIn(['problem', 'snapshotId']);

  return {
    href: getTraceViewFilteredBySnapshotIdAndTimeframe({
      snapshotId: serviceId,
      from: event.get('start'),
      to: event.get('end')
    }).nextFrame(),

    numberOfTraces: getNumberOfTracesTouchingService(serviceId)
  };
},
function EventTraces({event, href, numberOfTraces}) {
  const serviceId = event.getIn(['problem', 'snapshotId']);

  const to = (event.get('state') === 'closed') ? event.get('end') : null;
  const from = event.getIn(['metadata', 'triggeringTime'], event.get('start'));
  const timeframe = {
    to,
    windowSize: event.get('end') - from
  };
  if (event.get('state') === 'open') {
    timeframe.windowSize += chartOffset;
  }

  return (
    <DescriptionList className={block}>
      <DescriptionItem id='title'
                       title={
                         <div className={`${block}__title-wrapper`}>
                           <SvgIcon className={`${block}__icon`}
                                    type='traces'
                                    width={24}
                                    color={'#22d8d8'} />
                           Traces Touching
                         </div>
                       }>
        <Button className={`${block}__button`}
                kind='secondary'
                size='sm'
                href={href}>
          View Traces
        </Button>

        <DescriptionList className={`${block}__metrics`}>
          <DescriptionItem className={itemClassName}
                           title='Number of traces'>
            {numberOfTraces}
          </DescriptionItem>

          <DescriptionItem className={itemClassName}
                           title='Avg response time'>
            <MetricValue snapshotId={serviceId}
                         metric='duration.mean'
                         formatter={timeByMillisTwoDecimalPlaces}
                         timeWindowAggregation='mean'
                         timeframe={timeframe} />
          </DescriptionItem>

          <DescriptionItem className={itemClassName}
                           title='Highest response time'>
            <MetricValue snapshotId={serviceId}
                         metric='duration.max'
                         formatter={timeByMillisTwoDecimalPlaces}
                         timeWindowAggregation='max'
                         timeframe={timeframe} />
          </DescriptionItem>

          <DescriptionItem className={itemClassName}
                           title='Avg error count'>
            <MetricValue snapshotId={serviceId}
                         metric='error_rate'
                         formatter={twoDecimalPlaces}
                         timeWindowAggregation='mean'
                         timeframe={timeframe} />
          </DescriptionItem>
        </DescriptionList>
      </DescriptionItem>
    </DescriptionList>
  );
}),
isVisible
);

function isVisible(event) {
  return (event && event.get('affectedService', null) != null);
}
