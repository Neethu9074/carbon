import React from 'react/addons';

import * as mapFilters from 'in-services/stores/mapFilters';
import {getColor} from 'in-services/tags';

import TagToolTip from '../../../Tooltips/Tag';
import {currentTooltip2D} from '../../../../mapStores';

import './Tag.less';

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
    currentTooltip2D.emit(this.tooltip);
  },

  mouseOut() {
    currentTooltip2D.emit(null);
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
