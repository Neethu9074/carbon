import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getColorForIssue} from 'in-services/issueTracker';
import {theme} from 'in-services/theme';

import './IssueLine.less';

const IssueLine = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    style: React.PropTypes.object,
    issue: irpt.map.isRequired,
    scale: React.PropTypes.func.isRequired
  },

  render() {
    const issue = this.props.issue;

    let right = this.props.scale(issue.get('end')).toFixed(2);
    if (right < 0) {
      right = 0 + '%';
    } else {
      right = (100 - Math.min(100, right)) + '%';

    }
    const style = this.props.style ? this.props.style : {};
    style.borderColor = getColorForIssue(issue);
    style.color = theme.health[issue.getIn(['problem', 'severity'])];
    style.right = right;

    return (
      <div className={'in-timeline-issue-line'}
           style={style}>
      </div>
    );
  }
});

export default IssueLine;
