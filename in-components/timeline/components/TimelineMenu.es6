import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {isCollapsed$, toggleMenu} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';

import './TimelineMenu.less';


const block = 'in-bottom-timeline-menu';
const rpt = React.PropTypes;

export default connectTo({
    isCollapsed: isCollapsed$
  },
  React.createClass({

    displayName: 'TimelineMenu',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      isCollapsed: rpt.bool
    },

    render() {
      return (
        <div className={block}
             onClick={toggleMenu}>
          schnipimenu
        </div>
      );
    }
  })
);
