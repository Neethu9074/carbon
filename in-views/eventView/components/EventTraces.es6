import React from 'react';

import createTraceInformationObservable from 'in-services/subscription/traceInformationByServiceId';
import {twoDecimalPlaces, timeByMillisTwoDecimalPlaces} from 'in-services/formatters/number';
import {getTraceViewFilteredBySnapshotIdAndTimeframe} from 'in-stores/navigation/search';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import addSection from 'in-views/eventView/hocs/addSection';
import LoadingIndicator from 'in-components/LoadingIndicator';
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

  const serviceId = event.get('affectedService');

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
    return (
      <LoadingIndicator inline={true}
                               type='dark'
                               style={{ height: '16px' }} />
    );
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
          {traceInfo('Number of traces',
                     traceInformation.get('numberOfTraces', null))}

          {traceInfo('Avg response time',
                     traceInformation.get('averageResponseTime', null),
                      timeByMillisTwoDecimalPlaces)}
          {traceInfo('Highest response time',
                     traceInformation.get('highestResponseTime', null),
                     timeByMillisTwoDecimalPlaces)}
          {traceInfo('Avg error count',
                     traceInformation.get('averageErrorCount', null),
                     twoDecimalPlaces)}
        </DescriptionList>
      </DescriptionItem>
    </DescriptionList>
  );
}),
isVisible
);

function traceInfo(title, value, formatter) {
  if (value == null) {
    return null;
  }

  return (
    <DescriptionItem className={itemClassName}
                     title={title}>
      {formatter ? formatter(value) : value}
    </DescriptionItem>
  );
}

function isVisible(event) {
  return __DEV__ && (event && event.get('affectedService', null) != null);
}
