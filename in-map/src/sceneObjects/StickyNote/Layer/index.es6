

import React from 'react/addons';
import StickyNote from '../StickyNote';

import './index.less';


/*eslint-disable no-unused-vars*/
const LayerStickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    style: React.PropTypes.object.isRequired,
    height: React.PropTypes.any.isRequired
  },

  render() {
    //const numLayer = this.props.numLayer;
    const style = {height: this.props.height};
    const component = (
      <div className='in-sticky-note-layer__container' style={style}>
        <div className='in-sticky-note-layer__content'>
           -- layer
        </div>
      </div>
    );

    return component;
  }
});
/*eslint-enable no-unused-vars*/

export default class StickyNoteLayer extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note-layer'});
    this.render();
  }

  render() {
    React.render(
      <LayerStickyNoteRC snapshot={this.parent.snapshot} />,
      this.stickyNoteContainer
    );
  }
}
