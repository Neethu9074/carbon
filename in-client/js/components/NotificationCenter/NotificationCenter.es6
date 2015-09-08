import React from 'react/addons';

import './NotificationCenter.less';

const block = 'in-notificationcenter';

const NotificationCenter = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {

  },

  render() {
    return (
      <div className={block}>
        Hallo
      </div>
    );
  }
});

export default NotificationCenter;
