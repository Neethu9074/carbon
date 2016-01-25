import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import {getColorForIssue} from 'in-services/issueTracker';
import {getClassName} from 'in-services/react';

import SnapshotDiscription from '../SnapshotDiscription';
import Icon from '../Icon';

import './IssueDiscription.less';

const rpt = React.PropTypes;
const block = 'in-issue-discription';

export default React.createClass({

  displayName: 'IssueDiscription',

  propTypes: {
    issue: irpt.map.isRequired,
    className: rpt.string,
    plugin: rpt.string
  },

  render() {
    const issue = this.props.issue;
    const color = getColorForIssue(issue);
    const className = getClassName(this, block);

    return (
      <div className={className}>
        <Icon className={block + '__icon'}
              type={this.getIconType(issue)}
              style={{color}}/>
        <div className={block + '__discription'}>
          <div className={block + '__time'}>
            {moment(issue.get('start')).fromNow()}
          </div>

          <div className={block + '__header'}
            style={{color}}>
            {issue.getIn(['problem', 'problemText'])}
          </div>

          <div className={block + '__suggestion'}>
            {issue.getIn(['problem', 'fixSuggestion'])}
          </div>

          <SnapshotDiscription snapshot={issue.get('problem')} />
        </div>
      </div>
    );
  },

  getIconType(issue) {
    const type = issue.getIn(['problem', 'severity']) > 8 ? 'critical' : 'warning';
    return type;
  }
});
