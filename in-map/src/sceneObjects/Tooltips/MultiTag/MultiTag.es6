import React from 'react/addons';

import TooltipFrame from 'in-components/Tooltips/Frame';
import Heading from 'in-components/Tooltips/Heading';
import {getColor} from 'in-services/tags';

import Tooltip from '../Tooltip';

import './MultiTag.less';

const MultiTagRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    tags: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <TooltipFrame>
        <ul className='in-tooltip__multitag-frame--ul'>
          {this.props.tags.map((tag) => {
            return (
              <li key={tag} className='in-tooltip__multitag-frame--li'>
                <Heading style={{color: getColor(tag)}}
                         className='in-tooltip__multitag-heading'>
                  {tag}
                </Heading>
              </li>
            );
          })}
        </ul>
      </TooltipFrame>
    );
  }
});


export default class TooltipMultiTag extends Tooltip {
  constructor({parent, tags}) {
    super(parent);

    this.tags = tags;
  }

  render() {
    React.render(
      <MultiTagRC
        snapshot={this.parent.snapshot}
        tags={this.tags}/>,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
