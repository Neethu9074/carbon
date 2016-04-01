import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {mapSeverityToHealth} from 'in-services/health';
import {emptyArray} from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

import {FILTER_TYPES, Issue$} from './notificationCenterFlyoutStores';
import Filter from './Filter';

import './FilterBar.less';


const block = 'in-notificationcenter-filterbar';

export default connectTo({
    allIssues: Issue$
  },
  React.createClass({

    displayName: 'NotificationFilterBar',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      allIssues: irpt.list
    },

    render() {
      const counter = this.getIssuesCounter();

      return (
        <div className={block}>
          <Filter label={'All'}
                  filter = {FILTER_TYPES.ALL}/>

          <Filter label={'' + counter.danger}
                  filter={FILTER_TYPES.CRITICAL}/>

          <Filter label={'' + counter.warning}
                  filter={FILTER_TYPES.WARNING}/>

          <Filter label={'' + counter.change}
                  filter={FILTER_TYPES.CHANGE}/>
        </div>
      );
    },

    getIssuesCounter() {
      const counter = {
        warning: 0,
        danger: 0,
        change: 0
      };

      const allIssues = this.props.allIssues || emptyArray;
      allIssues.forEach(issue => {
        const issueHealth = mapSeverityToHealth(issue.getIn(['problem', 'severity']));
        if (!issueHealth) {
          return;
        }

        if (issueHealth === 'ok') {
          counter.change++;
        } else {
          counter[issueHealth]++;
        }
      });

      return counter;
    }
  })
);
