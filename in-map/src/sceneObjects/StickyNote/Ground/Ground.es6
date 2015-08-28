import React from 'react/addons';

import StickyNote from '../StickyNote';

import './Ground.less';

const GroundStickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    color: React.PropTypes.object.isRequired,
    label: React.PropTypes.string.isRequired
  },

  render() {
    const c = this.props.color;
    const backgroundColor = 'rgb(' + ((c.r * 255) | 0) + ',' + ((c.g * 255) | 0) + ',' + ((c.b * 255) | 0) + ')';

    return (
      <div className='in-sticky-note__group__content'
           style={{backgroundColor}}>
        {this.props.label}
      </div>
    );
  }
});


export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note-group'});
    this.render();
  }

  render() {
    React.render(
      <GroundStickyNoteRC label={this.parent.id}
                    color={this.parent.getColor()} />,
      this.stickyNoteContainer
    );
  }
}
