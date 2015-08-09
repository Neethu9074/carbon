

import React from 'react/addons';

import ContentHeading from '../ContentHeading';

import './DashboardSection.less';

const block = 'in-dashboard-section';
const rpt = React.PropTypes;

const DashboardSection = React.createClass({
  mixins: [React.addons.PureRenderMixin],

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
