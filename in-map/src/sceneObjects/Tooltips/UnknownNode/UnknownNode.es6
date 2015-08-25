import React from 'react/addons';

import TooltipFrame from 'in-components/Tooltips/Frame';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';

import Tooltip from '../Tooltip';


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
          {'This host is not monitored.'}
        </Content>
      </TooltipFrame>
    );
  }
});


export default class TooltipNode extends Tooltip {
  constructor(parent) {
    super(parent);
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
