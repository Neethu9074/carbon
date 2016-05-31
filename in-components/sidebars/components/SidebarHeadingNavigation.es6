/* eslint-disable react/no-multi-comp, react/prop-types */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {setSelectedSnapshotId} from 'in-stores/snapshot';
import * as navigation from 'in-stores/navigation';
import {getClassName} from 'in-services/react';
import Button from 'in-components/Button';

import './SidebarHeadingNavigation.less';


const block = 'in-sidebar-heading-navigation';
const rpt = React.PropTypes;

const SidebarHeadingNavigation = React.createClass({
  mixins: [
    PureRenderMixin
  ],

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

export default SidebarHeadingNavigation;

const ViewDashboardButton = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <Button className={block + '__button'}
              onClick={this.openDashboard}>
        view dashboard
      </Button>
    );
  },

  openDashboard() {
    setSelectedSnapshotId(this.props.snapshot.get('id'));
    navigation.goToDashboard();
  }
});
SidebarHeadingNavigation.ViewDashboardButton = ViewDashboardButton;

const BackToMap = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <Button className={block + '__button'}
              onClick={navigation.goToMap}>
        back to map
      </Button>
    );
  }
});
SidebarHeadingNavigation.BackToMap = BackToMap;
