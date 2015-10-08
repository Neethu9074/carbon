import React from 'react/addons';

import Icon from 'in-components/Icon';

import './Header.less';

const block = 'in-dashboard-header';

const DashboardHeader = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  render() {
    return (
      <div className={block}>
        <Icon className={block + '__icon'}
              type={'dashboard'}/>
        Dashboard
      </div>
    );
  }
});

export default DashboardHeader;
