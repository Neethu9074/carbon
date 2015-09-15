import React from 'react/addons';

import {createTagFilter} from 'in-services/filtering';
import * as filters from 'in-services/stores/filters';
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

  onClick() {
    filters.addFilter(createTagFilter(this.props.tag));
  },

  render() {
     return (
      <div style={{backgroundColor: getColor(this.props.tag)}}
           className='in-sticky-note__tag'
           onMouseOver={this.mouseOver}
           onMouseOut={this.mouseOut}
           onClick={this.onClick}>
      </div>
    );
  }
});

export default TagStickyNote;
