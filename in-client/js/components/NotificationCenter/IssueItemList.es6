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
    const days = this.getIssuesPerDay(this.props.issues);
    const dailyIssues = Object.keys(days);
    return (
      <ul className={block}>
        {dailyIssues.map(key => {
          const issues = days[key];
          return (
            <li key={key}
                className={block + '__list-item'}>

              <span className={block + '__header-label'}>
                {key}
              </span>

              {issues.map(issue => <IssueItem issue={issue}/>)}

            </li>
          );
        })}
     </ul>
    );
  },

  getIssuesPerDay(issues) {
    const days = {};

    issues.forEach(issue => {
      const issueStartingDate = new Date(issue.get('start'));

      const day = issueStartingDate.getDate();
      const month = issueStartingDate.getMonth();
      const year = issueStartingDate.getFullYear();

      const dateString = day + '-' + month + '-' + year;
      if (!days[dateString]) {
        days[dateString] = [];
      }
      days[dateString].push(issue);
    });

    return days;
  }
});

export default IssueItemList;
