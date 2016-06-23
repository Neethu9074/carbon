import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import {
  EVENT_LISTS,
  selectedEventList$,
  setSelectedList
} from 'in-components/notificationCenter/Flyout/stores/flyoutStore';

import './EventListSwitcher.less';


const block = 'in-notificationcenter-event-list-switcher';

export default connectTo({
    selectedEventList: selectedEventList$
  },
  React.createClass({

    displayName: 'NotificationEventListSwitcher',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      selectedEventList: React.PropTypes.string
    },

    render() {
      const buttonBlock = block + '__button';
      const selectedClassName = ' ' + buttonBlock + '__selected';

      return (
        <div className={block}>
          <Button className={buttonBlock +
                             (this.props.selectedEventList === EVENT_LISTS.HISTORICAL ? selectedClassName : '')}
                  onClick={() => setSelectedList(EVENT_LISTS.HISTORICAL)}>
            Time Range
          </Button>
          <Button className={buttonBlock +
                            (this.props.selectedEventList === EVENT_LISTS.CURRENT ? selectedClassName : '')}
                  onClick={() => setSelectedList(EVENT_LISTS.CURRENT)}>
            Active
          </Button>
        </div>
      );
    }
  })
);
