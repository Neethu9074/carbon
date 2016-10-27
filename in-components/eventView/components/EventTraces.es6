import React from 'react';

import createTraceInformationObservable from 'in-services/subscription/traceInformationByServiceId';
import {twoDecimalPlaces, timeByMillisTwoDecimalPlaces} from 'in-services/formatters/number';
import {getTraceViewFilteredBySnapshotIdAndTimeframe} from 'in-stores/navigation/search';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import addSection from 'in-components/eventView/hocs/addSection';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './EventTraces.less';


const block = 'in-event-details-traces';
const itemClassName = `${block}__item`;

export default addSection(connectTo(props => {
  const event = props.event;
  const from = event.get('start');
  let to = event.get('end');
  if (event.get('state') === 'open') {
    to = null;
  }

  // TODO: replace with triggering id
  const serviceId = event.getIn(['problem', 'snapshotId']);

  return {
    href: getTraceViewFilteredBySnapshotIdAndTimeframe({
      snapshotId: serviceId,
      from,
      to: event.get('end')
    }).nextFrame(),

    traceInformation: createTraceInformationObservable({
      snapshotId: serviceId,
      from,
      to
    })
  };
},
function EventTraces({href, traceInformation}) {
  if (!traceInformation) {
    return null;
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
          Traces
        </div>
      }>
        <Button className={`${block}__button`}
                kind='secondary'
                size='sm'
                href={href}>
          View
        </Button>

        <DescriptionList className={`${block}__metrics`}>
          <DescriptionItem className={itemClassName}
                           title='Number of traces'>
            {traceInformation.get('numberOfTraces')}
          </DescriptionItem>
          <DescriptionItem className={itemClassName}
                           title='Avg response time'>
            {timeByMillisTwoDecimalPlaces(traceInformation.get('averageResponseTime'))}
          </DescriptionItem>
          <DescriptionItem className={itemClassName}
                           title='Highest response time'>
            {timeByMillisTwoDecimalPlaces(traceInformation.get('highestResponseTime'))}
          </DescriptionItem>
          <DescriptionItem className={itemClassName}
                           title='Avg error count'>
            {twoDecimalPlaces(traceInformation.get('averageErrorCount'))}
          </DescriptionItem>
        </DescriptionList>
      </DescriptionItem>
    </DescriptionList>
  );
}),
isVisible
);

function isVisible(event) {
  return (event && event.getIn(['metadata', 'triggering']));
}
