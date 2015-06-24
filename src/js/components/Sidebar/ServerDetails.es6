'use strict';

import React from 'react/addons';

import './ServerDetails.less';

const block = 'in-sidebar-server-details';

const ServerDetails = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <div className={block}>
        {this.props.snapshot.get('steadyId')}
      </div>
    );
  }
});

export default ServerDetails;
