'use strict';

import React from 'react';

import ServerDetails from './ServerDetails';

import './index.less';

const block = 'in-detail-pane';

const DetailPane = React.createClass({
  render() {
    return (
      <div className={block}>

        {this.props.sidebarVisible ?
          <ServerDetails snapshot={this.props.snapshot} />
        : null}
      </div>
    );
  }
});

export default DetailPane;
