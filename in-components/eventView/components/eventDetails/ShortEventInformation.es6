import React from 'react';

import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import {formatDateTime} from 'in-services/formatters/date';
import EventIcon from 'in-components/EventIcon/EventIcon';

import './ShortEventInformation.less';


const block = 'in-event-short-event-information';

export default function ShortEventInformation({event}) {
  const end = event.get('end');

  return (
    <div className={block}>
      <EventIcon event={event}
                 className={`${block}__icon`} />

      <LabeledValue label='Started'>
        {formatDateTime(event.get('start'))}
      </LabeledValue>

      <LabeledValue label='Ended'>
        {end ? formatDateTime(end) : 'active'}
      </LabeledValue>
    </div>
  );
}
