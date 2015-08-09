

import React from 'react/addons';
import {IntlMixin} from 'react-intl';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import {create} from 'in-services/conveyer';
import NotificationDialog from 'in-components/NotificationDialog';

const NoNodesDialog = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin,
    IntlMixin
  ],

  propTypes: {
    pluginId: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {open: false};
  },

  componentDidMount() {
    this.addSubscription(
      create(SnapshotConveyer, {pluginId: this.props.pluginId})
        .subscribe(data => this.setState({open: data.size === 0}))
    );
  },

  render() {
    if(!this.state.open) {
      return null;
    }

    return (
      <NotificationDialog title={this.getIntlMessage('noNodesDialog.header')}
                          closeButtonVisible={false}>
        {this.getIntlMessage('noNodesDialog.content')}
      </NotificationDialog>
    );
  }
});

export default NoNodesDialog;
