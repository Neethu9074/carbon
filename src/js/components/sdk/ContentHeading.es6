'use strict';

import React from 'react/addons';

import './ContentHeading.less';

const ContentHeading = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <h1 className='in-dashboard__content-heading'>
        {this.props.children}
      </h1>
    );
  }
});

export default ContentHeading;
