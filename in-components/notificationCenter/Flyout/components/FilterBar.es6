import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  FILTER_TYPES,
  event$,
  selectedEventList$,
  EVENT_LISTS
} from 'in-components/notificationCenter/Flyout/flyoutStore';
import Filter from 'in-components/notificationCenter/Flyout/components/Filter';
import {emptyArray} from 'in-services/fixedObjects';
import {countEvents} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './FilterBar.less';


const block = 'in-notificationcenter-filterbar';

export default connectTo({
    allEvents: event$,
    selectedEventList: selectedEventList$
  },
  React.createClass({

    displayName: 'NotificationFilterBar',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      allEvents: irpt.list,
      selectedEventList: React.PropTypes.string.isRequired
    },

    render() {
      const counter = countEvents(this.props.allEvents || emptyArray);

      return (
        <div className={block}>
          <Filter label={'All'}
                  filter = {FILTER_TYPES.ALL}/>

          <Filter label={'' + counter.incident}
                  filter={FILTER_TYPES.INCIDENT}/>

          <Filter label={'' + counter.danger}
                  filter={FILTER_TYPES.CRITICAL}/>

          <Filter label={'' + counter.warning}
                  filter={FILTER_TYPES.WARNING}/>

          {this.props.selectedEventList === EVENT_LISTS.HISTORICAL ?
            <Filter label={'' + counter.change}
                    filter={FILTER_TYPES.CHANGE}/>
          : null}
        </div>
      );
    }
  })
);
