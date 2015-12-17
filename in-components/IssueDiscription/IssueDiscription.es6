import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-components/hoc/connectTo';
import {getColorForIssue} from 'in-services/issueTracker';
import {getFullSnapshot, extractCoordinates} from 'in-services/snapshots';

import './IssueDiscription.less';

const block = 'in-issue-discription';

export default connectTo(
  props => {
    return {
      snapshot: getFullSnapshot(extractCoordinates(props.issue.get('problem')))
    };
  },
  React.createClass({
  displayName: 'IssueDiscription',

  propTypes: {
    issue: irpt.map.isRequired,
    snapshot: irpt.map
  },

  render() {
    const issue = this.props.issue;
    console.log('issue', JSON.parse(JSON.stringify(issue)));
    if (this.props.snapshot) {
      console.log('label:', getLabel(this.props.snapshot));
    }

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
          {this.props.snapshot ?
            ' in component ' + getLabel(this.props.snapshot)
          : null}
        </div>
      </div>
    );
  }
}));
