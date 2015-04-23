'use strict';

import './index.less';

import React from 'react';

const rpt = React.PropTypes;

const StickyNote = React.createClass({

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  render() {
    return (
      <div>
        {this.props.snapshot.get('hostId')}
      </div>
    );
  }
});

export default StickyNote;
