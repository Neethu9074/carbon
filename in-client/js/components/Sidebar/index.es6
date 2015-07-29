'use strict';

import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';

import FloatingFrame from './FloatingFrame';
import Listing from './Listing';

const rpt = React.PropTypes;

const Sidebar = React.createClass({

  mixins: [React.addons.PureRenderMixin, SubscriptionMixin],

  propTypes: {
    pluginId: rpt.string.isRequired
  },

  componentDidMount() {
    this.addSubscription(
      selectedSnapshotStore.selectedSnapshot
        .subscribe(snapshot => {
          if (snapshot) {
            this.refs.details.open();
          }
        })
    );
  },

  render() {
    return (
      <FloatingFrame icon='sidebar'
                     title='Details'
                     content={Listing}
                     contentProps={{
                       pluginId: this.props.pluginId
                     }}
                     ref='details'/>
    );
  }
});

export default Sidebar;
