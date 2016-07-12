import React from 'react';

import {getClassName} from 'in-services/react';

import './SidebarHeadingNavigation.less';


const block = 'in-sidebar-heading-navigation';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'SidebarHeadingNavigation',

  propTypes: {
    className: rpt.string,
    children: rpt.any
  },

  render() {
    return (
      <div className={getClassName(this, block)}>
        {this.props.children}
      </div>
    );
  }
});
