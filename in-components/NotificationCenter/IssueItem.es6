import irpt from 'react-immutable-proptypes';
import React from 'react/addons';
import moment from 'moment';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import {extractCoordinates} from 'in-services/snapshots';
import {getColorForIssue} from 'in-services/issueTracker';
import Icon from 'in-components/Icon';

import './IssueItem.less';

const block = 'in-notificationcenter-issueitem';

const IssueItem = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    issue: irpt.map.isRequired
  },

  render() {
    const issue = this.props.issue;

    return (
      <div className={block}
           onClick={() => this.focusSnapshot(issue)}>

        <div className={block + '__header'}
             style={{color: getColorForIssue(issue)}}>

          <Icon type={'warning'}
                className={block + '__icon'}/>
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
  },

  focusSnapshot(issue) {
    const problemCoordinates = extractCoordinates(issue.get('problem'));
    selectedSnapshotStore.select(problemCoordinates);
  }
});

export default IssueItem;
