import PureRenderMixin from 'react-addons-pure-render-mixin';
// import irpt from 'react-immutable-proptypes';
import React from 'react';

import './Timeline.less';


const block = 'in-bottom-timeline';
// const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'Timeline',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    // propName: rpt.renderable.isRequired
  },

  render() {
    return (
      <div className={block}>

      </div>
    );
  }
});
