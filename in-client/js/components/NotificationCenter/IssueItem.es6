import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getColorForIssue} from 'in-services/issueTracker';

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
      <div className={block}>

        <div className={block + '__header'}
             style={{color: getColorForIssue(issue)}}>
          {issue.get('problem').get('problemText')}
        </div>

        <div className={block + '__suggestion'}>
          suggestion
        </div>

        <div className={block + '__time'}>
          {'17m ago'}
        </div>

        <div className={block + '__breakingline'}/>

      </div>
    );
  }
});

export default IssueItem;
