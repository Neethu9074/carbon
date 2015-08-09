

import React from 'react/addons';

import './ContentHeading.less';

const rpt = React.PropTypes;

const ContentHeading = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    children: rpt.any.isRequired
  },

  render() {
    return (
      <h1 className='in-dashboard__content-heading'>
        {this.props.children}
      </h1>
    );
  }
});

export default ContentHeading;
