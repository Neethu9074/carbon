import irpt from 'react-immutable-proptypes';
import React from 'react/addons';
import d3 from 'd3';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import IssueDiscription from 'in-components/IssueDiscription';
import {getColorForIssue} from 'in-services/issueTracker';
import {extractCoordinates} from 'in-services/snapshots';
import {mapSeverityToHealth} from 'in-services/health';
import Tooltip from 'in-components/Tooltip';
import Icon from 'in-components/Icon';

import './Issue.less';

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
    style.color = getColorForIssue(issue);

    return (
      <Tooltip  align={'top'}
                content={<IssueDiscription key={issue.get('id')}
                                           issue={issue}/>}>

        <Icon type={mapSeverityToHealth(issue.getIn(['problem', 'severity']))}
              onMouseEnter={() =>this.props.mouseIn(issue)}
              onClick={() => this.focusSnapshot(issue)}
              onMouseLeave={this.props.mouseOut}
              className={'in-timeline-issue'}
              style={style}
        />

      </Tooltip>
    );
  },

  focusSnapshot(issue) {
    const problemCoordinates = extractCoordinates(issue.get('problem'));
    selectedSnapshotStore.select(problemCoordinates);
  }
});

export default Issue;
