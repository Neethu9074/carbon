'use strict';

import React from 'react/addons';
import TagToolTip from '../../../Tooltips/Tag';
import {getColor} from 'instana-ui-sdk/tags';

import './index.less';

const rpt = React.PropTypes;
export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    tag: rpt.object.isRequired,
    sceneObject: rpt.object.isRequired
  },

  mouseOver: function () {
    this.tooltip = new TagToolTip({
      parent: this.props.sceneObject,
      tag: this.props.tag
    });
  },

  mouseOut: function () {
    this.tooltip.dispose();
    this.tooltip = null;
  },

  render() {
     return (
      <div style={{backgroundColor: getColor(this.props.tag.label)}}
           className='in-sticky-note__tag'
           onMouseOver={this.mouseOver}
           onMouseOut={this.mouseOut}>
      </div>
    );
  }
});
