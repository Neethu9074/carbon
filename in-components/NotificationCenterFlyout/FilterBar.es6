import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {mapSeverityToHealth} from 'in-services/health';
import {emptyArray} from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

import {FILTER_TYPES, event$} from './notificationCenterFlyoutStores';
import Filter from './Filter';

import './FilterBar.less';


const block = 'in-notificationcenter-filterbar';

export default connectTo({
    allEvents: event$
  },
  React.createClass({

    displayName: 'NotificationFilterBar',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      allEvents: irpt.list
    },

    render() {
      const counter = this.getEventsCounter();

      return (
        <div className={block}>
          <Filter label={'All'}
                  filter = {FILTER_TYPES.ALL}/>

          <Filter label={'' + counter.danger}
                  filter={FILTER_TYPES.CRITICAL}/>

          <Filter label={'' + counter.warning}
                  filter={FILTER_TYPES.WARNING}/>

          <Filter label={'' + counter.ok}
                  filter={FILTER_TYPES.SYSTEM}/>
        </div>
      );
    },

    getEventsCounter() {
      const counter = {
        warning: 0,
        danger: 0,
        ok: 0
      };

      const allEvents = this.props.allEvents || emptyArray;
      allEvents.forEach(event => {
        const health = mapSeverityToHealth(event.getIn(['problem', 'severity']));
        if (!health) {
          return;
        }

        counter[health]++;
      });

      return counter;
    }
  })
);
