import irpt from 'react-immutable-proptypes';
import React from 'react/addons';
import d3 from 'd3';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import IssueDescription from 'in-components/IssueDescription';
import {extractCoordinates} from 'in-services/snapshots';
import Tooltip from 'in-components/Tooltip';
import {theme} from 'in-services/theme';
import Icon from 'in-components/Icon';

import './Issue.less';

const rpt = React.PropTypes;
const block = 'in-timeline-issue';

const Issue = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    mouseOut: rpt.func.isRequired,
    mouseIn: rpt.func.isRequired,
    issue: irpt.map.isRequired,
    style: rpt.object
  },

  getInitialState() {
    return {
      scale: d3.scale.linear().range([100, 0])
    };
  },

  render() {
    const issue = this.props.issue;
    const style = this.props.style ? this.props.style : {};
    const state = issue.get('state');
    style.color = state === 'OPEN' ? theme.health[issue.getIn(['problem', 'severity'])] : theme.health[0];

    return (
      <Tooltip  align={{vertical: 'top'}}
                content={<IssueDescription key={issue.get('id')}
                                           issue={issue}
                                           plugin={issue.getIn(['problem', 'pluginId'])}/>}>

        <Icon type={'warning'}
              onMouseEnter={() =>this.props.mouseIn(issue)}
              onClick={() => this.focusSnapshot(issue)}
              onMouseLeave={this.props.mouseOut}
              className={block}
              style={style} />
      </Tooltip>
    );
  },

  focusSnapshot(issue) {
    const problemCoordinates = extractCoordinates(issue.get('problem'));
    selectedSnapshotStore.select(problemCoordinates);
  }
});

export default Issue;
