import React from 'react/addons';

import TooltipFrame from 'in-components/Tooltips/Frame';
import Content from 'in-components/Tooltips/Content';

import {getLabel} from 'in-sdk/snapshot';

import Tooltip from '../Tooltip.es6';


const LayerTooltipRC = React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: React.PropTypes.object.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    const id = snapshot.get('steadyId');
    const text = id.length > 20 ? id.substring(0, 20) + '…' : id;
    return (
      <TooltipFrame>
        <Content>
          {getLabel(snapshot) + ': ' + text}
        </Content>
      </TooltipFrame>
    );
  }
});


export default class TooltipLayer extends Tooltip {
  constructor(parent) {
    super(parent);
  }

  render() {
    React.render(
      <LayerTooltipRC snapshot={this.parent.snapshot} />,
      this.stickyNoteContainer
    );
  }
}
