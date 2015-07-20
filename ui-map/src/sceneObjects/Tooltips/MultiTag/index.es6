'use strict';

import React from 'react/addons';
import Tooltip from '../Tooltip';

import TooltipFrame from 'instana-ui-components/Tooltips/Frame';
import Heading from 'instana-ui-components/Tooltips/Heading';

import {getColor} from 'instana-ui-services/tags';

import './index.less';


/*eslint-disable no-unused-vars*/
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
/*eslint-enable no-unused-vars*/

export default class TooltipMultiTag extends Tooltip {
  constructor({parent, tags}) {
    super(parent);

    this.tags = tags;
    this.render();
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
