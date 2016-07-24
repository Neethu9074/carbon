import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import './ContentHeading.less';

const rpt = React.PropTypes;

const ContentHeading = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    children: rpt.any.isRequired
  },

  render() {
    return (
      <h2 className='in-dashboard__content-heading'>
        {this.props.children}
      </h2>
    );
  }
});

export default ContentHeading;
