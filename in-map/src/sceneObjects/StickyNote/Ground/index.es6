import React from 'react/addons';

import {getColor} from 'in-sdk/zones';

import StickyNote from '../StickyNote';

import './index.less';


/*eslint-disable no-unused-vars*/
const GroundStickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    color: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <div className='in-sticky-note__group__content'
           style={{backgroundColor: this.props.color}}>
        {this.props.label}
      </div>
    );
  }
});
/*eslint-enable no-unused-vars*/


export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note-group'});
    this.render();
  }

  render() {
    React.render(
      <GroundStickyNoteRC label={this.parent.id}
                    color={getColor(this.parent.id) || '#0F0F0F'} />,
      this.stickyNoteContainer
    );
  }
}
