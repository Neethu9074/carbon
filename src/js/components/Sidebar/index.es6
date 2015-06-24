'use strict';

import React from 'react/addons';

import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';

import ServerListing from './ServerListing';
import ServerDetails from './ServerDetails';
import Metrics from './Metrics';
import FloatingFrame from './FloatingFrame';

import './index.less';

const Sidebar = React.createClass({

  mixins: [React.addons.PureRenderMixin, SubscriptionMixin],

  getInitialState() {
    return {
      selectedSnapshot: null
    };
  },

  componentDidMount() {
    selectedSnapshotStore.selectedSnapshot.subscribe(selectedSnapshot => {
      this.setState({selectedSnapshot});
    });
  },

  render() {
    return (
      <div className='in-sidebar'>
        <FloatingFrame icon='menue' title='Details'>
          {this.state.selectedSnapshot ?
            <ServerDetails snapshot={this.state.selectedSnapshot} />
          : <ServerListing />}
        </FloatingFrame>

        <FloatingFrame icon='stats' title='Metrics'>
          <Metrics />
        </FloatingFrame>
      </div>
    );
  }

});

export default Sidebar;
