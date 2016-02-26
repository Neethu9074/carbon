import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import ContentHeading from '../ContentHeading';

import './DashboardSection.less';

const block = 'in-dashboard-section';
const rpt = React.PropTypes;

const DashboardSection = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    title: rpt.string.isRequired,
    children: rpt.any
  },

  render() {
    return (
      <div className={block}>
        <ContentHeading>{this.props.title}</ContentHeading>
        {this.props.children}
      </div>
    );
  }
});

export default DashboardSection;
