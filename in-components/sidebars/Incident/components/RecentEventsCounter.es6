/* eslint-disable react/no-multi-comp */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import getEventsWithinTimerange from 'in-hoc/getEventsWithinTimerange';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import * as timelineStore from 'in-stores/timeline';
import {emptyArray} from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

import 'in-components/sidebars/incident/components/RecentEventsCounter.less';


const block = 'in-sidebar-incident-recent-events-counter';
const rpt = React.PropTypes;

export default getEventsWithinTimerange(
  connectTo({
    timeframe: timelineStore.timeframe
  },
  React.createClass({

      displayName: 'RecentEventsCounter',

      propTypes: {
        timeframe: timelineStore.timeframeShape,
        events: irpt.list
      },

      render() {
        const events = this.props.events;
        const timeframe = this.props.timeframe;
        if (!timeframe || !events || events.size === 0) {
          return null;
        }

        const counter = this.getEventsCounter(timeframe);

        return (
          <div className={block}>
            <Counter titleFirstLine={'Active'}
                     titleSecondLine={counter.activeIssues === 1 ? 'Issue' : 'Issues'}
                     value={counter.activeIssues}
                     total={counter.issues}/>
            <Counter titleSecondLine={counter.changes === 1 ? 'Change' : 'Changes'}
                     value={counter.changes}/>
            <Counter titleFirstLine={'Affected'}
                     titleSecondLine={counter.affectedEntities === 1 ? 'Entity' : 'Entities'}
                     value={counter.affectedEntities}/>
          </div>
        );
      },

      getEventsCounter(timeframe) {
        const counter = {
          affectedEntities: 0,
          activeIssues: 0,
          changes: 0,
          issues: 0
        };

        const events = this.props.events || emptyArray;
        const affectedEntities = {};
        events.forEach(event => {
          const snapshotId = event.getIn(['problem', 'snapshotId']);
          if (snapshotId) {
            affectedEntities[snapshotId] = true;
          }

          const type = getEventType(event);
          if (type === EVENT_TYPES.ISSUE_WARNING ||
              type === EVENT_TYPES.ISSUE_CRITICAL ||
              type === EVENT_TYPES.OK) {
            counter.issues++;

            if ((!timeframe.to && !event.get('end')) || // live mode and open
                (timeframe.to && event.get('end') > timeframe.to)) {
              // if the event is yet active
              counter.activeIssues++;
            }
          } else if (type === EVENT_TYPES.CHANGE) {
            counter.changes++;
          }
        });

        counter.affectedEntities = Object.keys(affectedEntities).length;

        return counter;
      }
    })
  )
);

const Counter = React.createClass({

  displayName: 'Counter',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    value: rpt.number.isRequired,
    titleSecondLine: rpt.string,
    titleFirstLine: rpt.string,
    total: rpt.number
  },

  render() {
    const className = block + '__counter';

    return (
      <div className={className}>
        {this.props.total ?
          <div className={className + '__flex-wrapper'}>
            <h2 className={className + '__value'}>
              {this.props.value}
            </h2>
            <span className={className + '__total'}>
              {this.props.total + ' total'}
            </span>
          </div>
          :
          <h2 className={className + '__value'}>
            {this.props.value}
          </h2>
        }
        <p className={className + '__title'}>
          {this.props.titleFirstLine}
        </p>
        <p className={className + '__title'}>
          {this.props.titleSecondLine}
        </p>
      </div>
    );
  }
});
