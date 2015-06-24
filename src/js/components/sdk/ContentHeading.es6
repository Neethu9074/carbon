'use strict';

import React from 'react/addons';

const ContentHeading = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <h1 className='in-detail-pane__content-heading'>
        {this.props.children}
      </h1>
    );
  }
});

export default ContentHeading;
