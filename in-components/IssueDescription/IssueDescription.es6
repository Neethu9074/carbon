import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import {getColorForIssue} from 'in-services/issueTracker';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {toHtml} from 'in-services/formatters/markdown';
import {getClassName} from 'in-services/react';
import getSnapshot from 'in-hoc/getSnapshot';

import SnapshotDescription from '../SnapshotDescription';
import Icon from '../Icon';

import './IssueDescription.less';

const rpt = React.PropTypes;
const block = 'in-issue-description';

export default getSnapshot(React.createClass({

  displayName: 'IssueDescription',

  propTypes: {
    snapshotId: rpt.string.isRequired,
    issue: irpt.map.isRequired,
    className: rpt.string,
    snapshot: irpt.map
  },

  render() {
    const issue = this.props.issue;
    const color = getColorForIssue(issue);
    const className = getClassName(this, block);

    return (
      <div className={className}
           onClick={this.onClick}>
        <Icon className={block + '__icon'}
              type={this.getIconType(issue)}
              style={{color}}/>
        <div className={block + '__description'}>
          <div className={block + '__time'}>
            {moment(issue.get('start')).fromNow()}
          </div>

          <div className={block + '__header'}
            style={{color}}>
            {issue.getIn(['problem', 'problemText'])}
          </div>

          <div className={block + '__suggestion'}
               dangerouslySetInnerHTML={{__html: toHtml(issue.getIn(['problem', 'fixSuggestion']))}} />

          <SnapshotDescription snapshot={this.props.snapshot} />
        </div>
      </div>
    );
  },

  getIconType(issue) {
    const severity = issue.getIn(['problem', 'severity']);

    if (severity < 0) {
      return 'change';
    } else if (severity > 8) {
      return 'critical';
    }
    return 'warning';
  },

  onClick() {
    setSelectedSnapshotId(this.props.snapshotId);
  }
}));
