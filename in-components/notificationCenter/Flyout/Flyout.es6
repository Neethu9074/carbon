import React from 'react';

import EventListSwitcher from 'in-components/notificationCenter/Flyout/components/EventListSwitcher';
import EventItemList from 'in-components/notificationCenter/Flyout/components/EventItemList';
import FilterBar from 'in-components/notificationCenter/Flyout/components/FilterBar';


export default function Flyout() {
  return (
    <div>
      <EventListSwitcher />
      <FilterBar />
      <EventItemList/>
    </div>
  );
}
