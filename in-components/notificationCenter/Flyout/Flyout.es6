import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import EventListSwitcher from 'in-components/notificationCenter/Flyout/components/EventListSwitcher';
import EventItemList from 'in-components/notificationCenter/Flyout/components/EventItemList';
import FilterBar from 'in-components/notificationCenter/Flyout/components/FilterBar';

import './Flyout.less';


const block = 'in-notificationcenter-flyout';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'Flyout',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    style: rpt.object
  },

  render() {
    return (
      <div className={block}>
        {'Notifications'}
        <EventListSwitcher />
        <FilterBar />
        <EventItemList style={this.props.style} />
      </div>
    );
  }
});
