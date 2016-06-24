import React from 'react';

import EventList from 'in-components/eventCenter/components/EventList';

import 'in-components/eventCenter/EventCenter.less';


const block = 'in-event-center';

export default function EventCenter() {
  return (
    <div className={block}>
      <EventList />
    </div>
  );
}
