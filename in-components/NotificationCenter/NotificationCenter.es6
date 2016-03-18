import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {mapSeverityToHealth} from 'in-services/health';
import {emptyArray} from 'in-services/fixedObjects';
import {getIssues} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';

import {FILTER_TYPES, selectedNotificationFilter} from './stores';
import IssueItemList from './IssueItemList';
import Filter from './Filter';

import './NotificationCenter.less';


const block = 'in-notificationcenter';
const rpt = React.PropTypes;

export default connectTo(
  () => {
    return {
      selectedNotificationFilter,
      allIssues: getIssues()
    };
  },
  React.createClass({

    displayName: 'NotificationCenterFlyout',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      selectedNotificationFilter: rpt.object,
      allIssues: irpt.list,
      style: rpt.object,
      open: rpt.bool
    },

    render() {
      return (
        <div className={block}>
          {'Notifications'}
          {this.renderFilterMenu()}
          {this.renderIssues()}
        </div>
      );
    },

    renderFilterMenu() {
      const counter = this.getIssuesCounter();

      return (
        <div className={block + '__status-bar'}>
          <Filter label={'All'}
                  filter = {FILTER_TYPES.ALL}/>

          <Filter label={counter.errors}
                  filter={FILTER_TYPES.CRITICAL}/>

          <Filter label={counter.warnings}
                  filter={FILTER_TYPES.WARNING}/>

          <Filter label={counter.ok}
                  filter={FILTER_TYPES.SYSTEM}/>
        </div>
      );
    },

    renderIssues() {
      const allIssues = this.props.allIssues;
      if (!allIssues) {
        return null;
      }

      return (
        <IssueItemList issues={allIssues.filter(issue => this.props.selectedNotificationFilter.predicate(issue))}
                       style={this.props.style}/>
      );
    },

    getIssuesCounter() {
      const counter = {
        warnings: 0,
        errors: 0,
        ok: 0
      };

      const allIssues = this.props.allIssues || emptyArray;
      allIssues.forEach(issue => {
        const issueHealth = mapSeverityToHealth(issue.getIn(['problem', 'severity']));
        if (!issueHealth) {
          return;
        }

        counter[issueHealth]++;
      });

      return counter;
    }
  })
);
