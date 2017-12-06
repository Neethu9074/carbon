import React from 'react';

import { getEventViewWithEvent } from 'in-stores/navigation/view';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import 'in-components/EventSidebar/components/Header.less';

const block = 'in-event-sidebar-header';

export default connectTo(
  props => {
    return {
      href: getEventViewWithEvent(props.eventId)
    };
  },
  function Header({ href }) {
    return (
      <div className={block}>
        <Button href={href} className={`${block}__button`}>
          Open Event View
        </Button>
      </div>
    );
  }
);
