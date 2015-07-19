'use strict';

import React from 'react/addons';
import Tooltip from '../Tooltip';
import TooltipFrame from 'instana-ui-components/Tooltips/Frame';
import Heading from 'instana-ui-components/Tooltips/Heading';
import Content from 'instana-ui-components/Tooltips/Content';


/*eslint-disable no-unused-vars*/
const UnknownNode = React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    ip: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <TooltipFrame>
        <Heading>
          {this.props.ip}
        </Heading>
        <Content>
          {'this host is unknown'}
        </Content>
      </TooltipFrame>
    );
  }
});
/*eslint-enable no-unused-vars*/

export default class TooltipNode extends Tooltip {
  constructor(parent) {
    super(parent);
    this.render();
  }

  render() {
    React.render(
      <UnknownNode
        snapshot={this.parent.snapshot}
        ip={this.parent.snapshot.get('steadyId')}
      />,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
