import irpt from 'react-immutable-proptypes';
import React from 'react/addons';
import d3 from 'd3';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import {getColorForIssue} from 'in-services/issueTracker';
import {extractCoordinates} from 'in-services/snapshots';
import {mapSeverityToHealth} from 'in-services/health';
import Icon from 'in-components/Icon';

import './Issue.less';

const Issue = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    issue: irpt.map.isRequired,
    style: React.PropTypes.object,
    mouseIn: React.PropTypes.func.isRequired,
    mouseOut: React.PropTypes.func.isRequired
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
      <Icon type={mapSeverityToHealth(issue.getIn(['problem', 'severity']))}
            className={'in-timeline-issue'}
            style = {style}
            onMouseEnter={() =>this.props.mouseIn(issue)}
            onMouseLeave={this.props.mouseOut}
            onClick={() => this.focusSnapshot(issue)}/>
    );
  },

  focusSnapshot(issue) {
    const problemCoordinates = extractCoordinates(issue.get('problem'));
    selectedSnapshotStore.select(problemCoordinates);
  }
});

export default Issue;
