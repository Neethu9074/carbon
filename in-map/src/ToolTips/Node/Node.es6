import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {health as healthStates} from 'in-services/health';
import TooltipFrame from 'in-components/Tooltips/Frame';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';
import {getLongLabel} from 'in-sdk/snapshot';
import getSnapshot from 'in-hoc/getSnapshot';
import getHealth from 'in-hoc/getHealth';

import Tooltip from '../Tooltip.es6';


const rpt = React.PropTypes;

const NodeTooltipRC = getHealth(
                      getSnapshot(
                      React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    layer: rpt.array.isRequired,
    health: rpt.string,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    const health = this.props.health;

    return (
      <TooltipFrame>
        {health !== healthStates.unknown ?
          <Heading>
            {'health: ' + health}
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
