'use strict';

import React from 'react/addons';
import Tooltip from '../Tooltip';

import TooltipFrame from 'in-components/Tooltips/Frame';
import Heading from 'in-components/Tooltips/Heading';

import {getColor} from 'in-services/tags';

import './index.less';


/*eslint-disable no-unused-vars*/
const TagStickyNote = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    tag: React.PropTypes.string.isRequired
  },

  render() {
    const tag = this.props.tag;

    return (
      <TooltipFrame>
        <Heading style={{color: getColor(tag)}}
                 className='in-tooltip__tag-heading'
         >
          {tag}
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
  }

  render() {
    React.render(
      <TagStickyNote
        snapshot={this.parent.snapshot}
        tag={this.tag}/>,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
