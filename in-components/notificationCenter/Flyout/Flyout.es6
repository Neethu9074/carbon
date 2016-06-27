import React from 'react';

import EventListSwitcher from 'in-components/notificationCenter/Flyout/components/EventListSwitcher';
import {isOpen$, close} from 'in-components/notificationCenter/Flyout/stores/visibilityStore';
import EventItemList from 'in-components/notificationCenter/Flyout/components/EventItemList';
import FilterBar from 'in-components/notificationCenter/Flyout/components/FilterBar';
import RightSidebar from 'in-components/RightSidebar';


export default function Flyout({style}) {
  return (
    <RightSidebar isOpen$={isOpen$}
                  onClose={close}
                  title='Notifications'>
      <EventListSwitcher />
      <FilterBar />
      <EventItemList style={style} />
    </RightSidebar>
  );
}
