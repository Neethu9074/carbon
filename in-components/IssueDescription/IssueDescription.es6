import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import {getFullSnapshot, extractCoordinates} from 'in-services/snapshots';
import {getColorForIssue} from 'in-services/issueTracker';
import {getClassName} from 'in-services/react';
import connectTo from 'in-components/hoc/connectTo';

import SnapshotDescription from '../SnapshotDescription';
import Icon from '../Icon';

import './IssueDescription.less';

const rpt = React.PropTypes;
const block = 'in-issue-discription';

export default connectTo(
  props => {
    return {
      snapshot: getFullSnapshot(extractCoordinates(props.issue.get('problem')))
    };
  },
  React.createClass({

  displayName: 'IssueDescription',

  propTypes: {
    issue: irpt.map.isRequired,
    snapshot: irpt.map,
    className: rpt.string,
    plugin: rpt.string
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

          <SnapshotDescription snapshot={this.props.snapshot} />
        </div>
      </div>
    );
  },

  getIconType(issue) {
    const severity = issue.getIn(['problem', 'severity']);

    if (severity < 0) {
      return 'instana_change';
    } else if (severity > 8) {
      return 'critical';
    }
    return 'warning';
  },

  onClick() {
    const coords = extractCoordinates(this.props.issue.get('problem'));
    selectedSnapshotStore.select(coords);
  }
}));
