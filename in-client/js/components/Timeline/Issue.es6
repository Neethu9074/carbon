import irpt from 'react-immutable-proptypes';
import React from 'react/addons';
import d3 from 'd3';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import IssueDiscription from 'in-components/IssueDiscription';
import {extractCoordinates} from 'in-services/snapshots';
import Tooltip from 'in-components/Tooltip';
import {theme} from 'in-services/theme';
import Icon from 'in-components/Icon';

import './Issue.less';

const block = 'in-timeline-issue';

const Issue = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    mouseOut: React.PropTypes.func.isRequired,
    mouseIn: React.PropTypes.func.isRequired,
    style: React.PropTypes.object,
    issue: irpt.map.isRequired
  },

  getInitialState() {
    return {
      scale: d3.scale.linear().range([100, 0])
    };
  },

  render() {
    const issue = this.props.issue;
    const style = this.props.style ? this.props.style : {};
    style.color = theme.health[issue.getIn(['problem', 'severity'])];

    return (
      <Tooltip  align={{vertical: 'top'}}
                content={<IssueDiscription key={issue.get('id')}
                                           issue={issue}/>}>

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
