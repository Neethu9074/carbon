import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import getMaxSeverityForOpenIssues from 'in-hoc/getMaxSeverityForOpenIssues';
import TooltipFrame from 'in-components/Tooltips/Frame';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';
import {getLongLabel} from 'in-sdk/snapshot';
import getSnapshot from 'in-hoc/getSnapshot';

import Tooltip from '../Tooltip.es6';


const rpt = React.PropTypes;

const NodeTooltipRC = getMaxSeverityForOpenIssues(
                      getSnapshot(
                      React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    maxSeverityForOpenIssues: rpt.number,
    snapshotId: rpt.string.isRequired,
    layer: rpt.array.isRequired,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    const maxSeverity = this.props.maxSeverityForOpenIssues;

    return (
      <TooltipFrame>
        {maxSeverity ?
          <Heading>
            {maxSeverity}
          </Heading>
          :
          <Content>
            {getLongLabel(snapshot, snapshot.getIn(['data', 'hostname']))}
          </Content>
        }
      </TooltipFrame>
    );
  }
})));

export default class TooltipNode extends Tooltip {
  constructor(parent) {
    super(parent);
  }

  render() {
    React.render(
      <NodeTooltipRC
        snapshotId={this.parent.id}
        layer={this.parent.getComponent('layer').layer}
      />,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
