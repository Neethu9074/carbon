'use strict';

import React from 'react/addons';
import Tooltip from '../Tooltip';

import TooltipFrame from 'instana-ui-components/Tooltips/Frame';
import Heading from 'instana-ui-components/Tooltips/Heading';

import {getColor} from 'instana-ui-sdk/tags';

import './index.less';


/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    tag: React.PropTypes.object.isRequired
  },

  render() {
    const tag = this.props.tag;

    return (
      <TooltipFrame>
        <Heading style={{color: getColor(tag.label)}}
                 className='in-tooltip__tag-heading'
         >
          {tag.label}
        </Heading>
      </TooltipFrame>
    );
  }
});
/*eslint-enable no-unused-vars*/

export default class TooltipTag extends Tooltip {
  constructor({parent, tag}) {
    super(parent);

    this.tag = tag;
    this.render();
  }

  render() {
    React.render(
      <StickyNoteRC
        snapshot={this.parent.snapshot}
        tag={this.tag}/>,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
