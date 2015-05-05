'use strict';

import React from 'react';

const ServerItem = React.createClass({
  render() {
    return (
      <li>
        {this.props.snapshot.get('hostId')}
      </li>
    );
  }
});

export default ServerItem;
