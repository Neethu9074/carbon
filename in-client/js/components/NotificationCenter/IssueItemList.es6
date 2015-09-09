import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import IssueItem from './IssueItem';

import './IssueItemList.less';

const block = 'in-notificationcenter-issueitemlist';

const IssueItemList = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    issues: irpt.list.isRequired
  },

  render() {
    const sortedIssue = this.props.issues.sort((a, b) => {
      return b.get('start') - a.get('start');
    });
    const days = this.getIssuesPerDay(sortedIssue);
    const dailyIssues = Object.keys(days);
    return (
      <ul className={block}>
        {dailyIssues.map(key => {
          const issues = days[key];
          return (
            <li key={key}
                className={block + '__list-item'}>

              <span className={block + '__header-label'}>
                {this.getDayStringForDate(key)}
              </span>

              {issues.map(issue => <IssueItem issue={issue}/>)}

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
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return day + '-' + month + '-' + year;
  }
});

export default IssueItemList;
