import irpt from 'react-immutable-proptypes';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {serverTime} from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';
import {getColorForIssue} from 'in-services/issueTracker';
import {theme} from 'in-services/theme';

import './IssueLine.less';

export default connectTo(
  () => {
    return {
      serverTime
    };
  },
  React.createClass({

  displayName: 'IssueLine',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    serverTime: React.PropTypes.number.isRequired,
    style: React.PropTypes.object,
    issue: irpt.map.isRequired,
    scale: React.PropTypes.func.isRequired
  },

  render() {
    const issue = this.props.issue;

    const end = issue.get('end', this.props.serverTime);
    let right = this.props.scale(end).toFixed(2);
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
}));
