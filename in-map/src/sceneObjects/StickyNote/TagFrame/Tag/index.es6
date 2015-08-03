'use strict';

import React from 'react/addons';

import {getColor} from 'in-services/tags';
import * as mapFilters from 'in-services/stores/mapFilters';

import TagToolTip from '../../../Tooltips/Tag';

import './index.less';

const rpt = React.PropTypes;
const TagStickyNote = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    tag: rpt.string.isRequired,
    sceneObject: rpt.object.isRequired
  },

  componentWillUnmount() {
    if(this.tooltip) {
      this.mouseOut();
    }
  },

  mouseOver() {
    this.tooltip = new TagToolTip({
      parent: this.props.sceneObject,
      tag: this.props.tag
    });
    this.tooltip.mount();
  },

  mouseOut() {
    this.tooltip.unMount();
    this.tooltip = null;
  },

  click() {
    mapFilters.addTagFilter(this.props.tag);
  },

  render() {
     return (
      <div style={{backgroundColor: getColor(this.props.tag)}}
           className='in-sticky-note__tag'
           onMouseOver={this.mouseOver}
           onMouseOut={this.mouseOut}
           onClick={this.click}>
      </div>
    );
  }
});

export default TagStickyNote;
