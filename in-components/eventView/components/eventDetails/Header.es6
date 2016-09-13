import React from 'react';

import ShortEventInformation from 'in-components/eventView/components/eventDetails/ShortEventInformation';
import EntityInformation from 'in-components/eventView/components/eventDetails/EntityInformation';
import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import Section from 'in-components/eventView/components/eventDetails/Section';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import Tooltip from 'in-components/Tooltip';

import './Header.less';


const block = 'in-event-view-event-detail-header';

export default function HeaderSwitch({event}) {
  const eventType = getEventType(event);

  return (
    <Section>
      <div>
        <ShortEventInformation event={event} />

        <br/>

        {eventType === EVENT_TYPES.INCIDENT
          ? <IncidentHeader event={event} />
          : <Header event={event} />
        }
      </div>
    </Section>
  );
}

function IncidentHeader({event}) {
  const numberOfRecentEvents = event.get('recentEvents').size;

  return (
    <div>
      <Title title={`Incident (${numberOfRecentEvents})`} />

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

function Header({event}) {
  return (
    <EntityInformation event={event}/>
  );
}

function Title({title}) {
  return (
    <h2 className={`${block}__title`}>
      {title}
    </h2>
  );
}
