import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';
import moment from 'moment';

import connectTo from 'in-hoc/connectTo';

import {Issue$, selectedNotificationFilter} from 'in-components/NotificationCenterFlyout/stores';
import IssueDescription from 'in-components/IssueDescription';

import './IssueItemList.less';


const block = 'in-notificationcenter-issueitemlist';
const rpt = React.PropTypes;

export default connectTo(
  () => {
    return {
      selectedNotificationFilter,
      allIssues: Issue$
    };
  },
  React.createClass({

    displayName: 'NotificationCenterIssueItemList',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      selectedNotificationFilter: rpt.object,
      allIssues: irpt.list,
      style: rpt.object
    },

    render() {
      const allIssues = this.props.allIssues;
      if (!allIssues) {
        return null;
      }

      const sortedIssue = allIssues
                            .filter(issue => this.props.selectedNotificationFilter.predicate(issue))
                            .sort((a, b) => b.get('start') - a.get('start'));
      const days = this.getIssuesPerDay(sortedIssue);
      const dailyIssues = Object.keys(days);

      return (
        <ul className={block}
            style={this.props.style}>
          {dailyIssues.map(key => {
            const issues = days[key];
            return (
              <li key={key}
                  className={block + '__list-item'}>

                <div className={block + '__header-label'}>
                  {this.getDayStringForDate(key)}
                </div>
                {issues.map(issue => <IssueDescription key={issue.get('id')}
                                                       issue={issue}
                                                       snapshotId={issue.getIn(['problem', 'snapshotId'])}
                                                       className={block + '__item'}/>)}
              </li>
            );
          })}
       </ul>
      );
    },

    getDayStringForDate(dateString) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (dateString === this.getDateString(today)) {
        return 'Today';
      } else if (dateString === this.getDateString(yesterday)) {
        return 'Yesterday';
      }
      return dateString;
    },

    getIssuesPerDay(issues) {
      const days = {};

      issues.forEach(issue => {
        const issueStartingDate = new Date(issue.get('start'));
        const dateString = this.getDateString(issueStartingDate);
        if (!days[dateString]) {
          days[dateString] = [];
        }
        days[dateString].push(issue);
      });

      return days;
    },

    getDateString(date) {
      return moment(date).format('YYYY-MM-DD');
    }
  })
);
