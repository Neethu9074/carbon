import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {health as healthStates} from 'in-services/health';
import TooltipFrame from 'in-components/Tooltips/Frame';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';
import getSnapshot from 'in-hoc/getSnapshot';
import getHealth from 'in-hoc/getHealth';

import Tooltip from '../Tooltip.es6';


const LayerTooltipRC = getHealth(
                       getSnapshot(
                       React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshotId: React.PropTypes.string.isRequired,
    health: React.PropTypes.string,
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
            {snapshot.get('plugin')}
          </Content>
        }
      </TooltipFrame>
    );
  }
})));


export default class TooltipLayer extends Tooltip {
  constructor(parent) {
    super(parent);
  }

  render() {
    React.render(
      <LayerTooltipRC snapshotId={this.parent.id}/>,
      this.stickyNoteContainer
    );
  }
}
