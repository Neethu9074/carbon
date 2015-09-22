import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import {getColorForIssue} from 'in-services/issueTracker';

import './IssueDiscription.less';

const block = 'in-issue-discription';

const IssueDiscription = React.createClass({
  propTypes: {
    issue: irpt.map.isRequired
  },

  render() {
    const issue = this.props.issue;

    return (
      <div className={block}>
        <div className={block + '__header'}
             style={{color: getColorForIssue(issue)}}>
           {issue.get('problem').get('problemText')}
        </div>

        <div className={block + '__suggestion'}>
          {issue.get('problem').get('fixSuggestion')}
        </div>

        <div className={block + '__time'}>
          {moment(issue.get('start')).fromNow()}
        </div>
      </div>
    );
  }
});

export default IssueDiscription;
