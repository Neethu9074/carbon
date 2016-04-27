import PureRenderMixin from 'react-addons-pure-render-mixin';
// import irpt from 'react-immutable-proptypes';
import React from 'react';

import './TimelineNavigation.less';


const block = '';
// const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'TimelineNavigation',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    // propName: rpt.renderable.isRequired
  },

  render() {
    return (
      <div className={block}>
        - ----------------- +
      </div>
    );
  }
});
