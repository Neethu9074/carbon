'use strict';

import React from 'react';

import ServerDetails from './ServerDetails';

import './index.less';

const block = 'in-detail-pane';

const DetailPane = React.createClass({
  render() {
    return (
      <div className={block}>
        <ServerDetails snapshot={this.props.snapshot} />
      </div>
    );
  }
});

export default DetailPane;
