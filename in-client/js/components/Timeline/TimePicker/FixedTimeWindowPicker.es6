import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import './FixedTimeWindowPicker.less';


const block = 'in-fixed-time-window-picker';

export default React.createClass({

  displayName: 'FixedTimeWindowPicker',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
  },

  render() {
    return (
      <div className={block}>
        this is a fixed time window picker
      </div>
    );
  }
});
