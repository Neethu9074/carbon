import React from 'react/addons';

import TooltipFrame from 'in-components/Tooltips/Frame';
import Content from 'in-components/Tooltips/Content';

import {getLabel} from 'in-sdk/snapshot';

import Tooltip from '../Tooltip';


/*eslint-disable no-unused-vars*/
const LayerTooltipRC = React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: React.PropTypes.object.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    return (
      <TooltipFrame>
        <Content>
          {getLabel(snapshot) + ': ' + snapshot.get('steadyId')}
        </Content>
      </TooltipFrame>
    );
  }
});
/*eslint-enable no-unused-vars*/

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
