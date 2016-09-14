import React from 'react';

import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import Section from 'in-components/eventView/components/eventDetails/Section';
import {formatDateTime} from 'in-services/formatters/date';
import EventIcon from 'in-components/EventIcon/EventIcon';
import Tooltip from 'in-components/Tooltip';

import './IncidentHeader.less';


const block = 'in-event-view-detail-incident-header';

export default function HeaderSwitch({event}) {
  const end = event.get('end');

  return (
    <Section>
      <div>
        <div className={`${block}__flex-wrapper`}>
          <EventIcon event={event}
                     className={`${block}__icon`} />

          <LabeledValue label='Started'>
            {formatDateTime(event.get('start'))}
          </LabeledValue>

          <LabeledValue label='Ended'>
            {end ? formatDateTime(end) : 'active'}
          </LabeledValue>
        </div>

        <div style={{ height: '0.3rem' }} />

        <IncidentHeader event={event} />
      </div>
    </Section>
  );
}

function IncidentHeader({event}) {
  const numberOfRecentEvents = event.get('recentEvents').size;

  return (
    <div>
      <h2 className={`${block}__title`}>
        {`Incident (${numberOfRecentEvents})`}
      </h2>

      <Tooltip content='Number of currently active issues'>
        <LabeledValue label='Active Issues'>
          0/0
        </LabeledValue>
      </Tooltip>

      <Tooltip content='Number of changes'>
        <LabeledValue label='Changes'>
          0
        </LabeledValue>
      </Tooltip>

      <Tooltip content='Number of affected entities'>
        <LabeledValue label='Affected'>
          0
        </LabeledValue>
      </Tooltip>
    </div>
  );
}
