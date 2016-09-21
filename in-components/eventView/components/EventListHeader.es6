import React from 'react';

import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import {events$} from 'in-components/eventView/stores/eventsStore';
import connectTo from 'in-hoc/connectTo';

import './EventListHeader.less';


const block = 'in-event-view-event-list-header';

export default connectTo({
  events: events$
},
function EventListHeader({}) {
  return (
    <ViewHeader className={block}>
      <h1 className={`${block}__title`}>
        {`Events (TODO EVENT COUNT)`}
      </h1>
    </ViewHeader>
  );
});
