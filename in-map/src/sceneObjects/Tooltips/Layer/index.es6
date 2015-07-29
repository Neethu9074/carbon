'use strict';

import React from 'react/addons';
import Tooltip from '../Tooltip';
import TooltipFrame from 'in-components/Tooltips/Frame';
import Content from 'in-components/Tooltips/Content';


/*eslint-disable no-unused-vars*/
const LayerTooltipRC = React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <TooltipFrame>
        <Content>
          {this.props.snapshot.get('steadyId')}
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

  dispose() {
    super.dispose();
  }
}
