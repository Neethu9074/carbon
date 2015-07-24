'use strict';

import React from 'react/addons';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import Stan from 'instana-ui-components/Stan';
// import Icon from 'instana-ui-components/Icon';

import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import {create} from 'instana-ui-services/conveyer';
import {plugins} from 'instana-ui-forge/constants';
import {IntlMixin} from 'react-intl';

import './index.less';

const block = 'in-no-nodes-dialog';

const Menu = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin,
    IntlMixin
  ],

  getInitialState() {
    return {open: false};
  },

  componentDidMount() {
    const observable = create(SnapshotConveyer, {pluginId: plugins.os});
    this.addSubscription(observable.subscribe(data => {
      if(data.size === 0) {
        this.setState({open: true});
      } else {
        if(this.state.open) {
          this.setState({open: false});
        }
      }
    }));
  },

  render() {
    if(!this.state.open) {
      return null;
    }

    return (
      <div className={block}>
        <span className={block + '__header'}>
          {this.getIntlMessage('noNodesDialog.header')}
        </span>
        <span className={block + '__content'}>
          {this.getIntlMessage('noNodesDialog.content')}
        </span>
        <Stan />
      </div>
    );
  }
});

export default Menu;
