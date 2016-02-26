import irpt from 'react-immutable-proptypes';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {mapSeverityToHealth, health} from 'in-services/health';
import IssueDescription from 'in-components/IssueDescription';
import Tooltip from 'in-components/Tooltip';
import {theme} from 'in-services/theme';
import Icon from 'in-components/Icon';

import './Issue.less';

const rpt = React.PropTypes;
const block = 'in-timeline-issue';

const Issue = React.createClass({
  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    mouseOut: rpt.func.isRequired,
    mouseIn: rpt.func.isRequired,
    issue: irpt.map.isRequired,
    style: rpt.object
  },

  render() {
    const issue = this.props.issue;
    const style = this.props.style ? this.props.style : {};
    const state = issue.get('state');
    const severity = issue.getIn(['problem', 'severity']);
    style.color = state === 'OPEN' ? theme.health[severity] : theme.health[0];

    let iconType;
    switch (mapSeverityToHealth(severity)) {
      case health.warning:
        iconType = 'warning';
        break;
      case health.danger:
        iconType = 'critical';
        break;
      default:
        iconType = 'change';
    }

    return (
      <Tooltip  align={{vertical: 'top'}}
                content={<IssueDescription key={issue.get('id')}
                                           issue={issue}
                                           snapshotId={issue.getIn(['problem', 'snapshotId'])}/>}>

        <Icon type={iconType}
              onMouseEnter={() =>this.props.mouseIn(issue)}
              onClick={() => setSelectedSnapshotId(issue.getIn(['problem', 'snapshotId']))}
              onMouseLeave={this.props.mouseOut}
              className={block}
              style={style} />
      </Tooltip>
    );
  }
});

export default Issue;
