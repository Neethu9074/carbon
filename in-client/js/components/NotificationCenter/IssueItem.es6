import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Icon from 'in-components/Icon';

import './IssueItem.less';

const block = 'in-notificationcenter-issueitem';
const rpt = React.PropTypes;


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
        {issue.get('problem').get('problemText')}
      </div>
    );
  }
});

export default IssueItem;
