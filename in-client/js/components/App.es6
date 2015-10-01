import {RouteHandler, Navigation} from 'react-router';
import {combineLatest} from 'reactive-observables';
import {IntlMixin} from 'react-intl';
import Immutable from 'immutable';
import React from 'react/addons';

import SnapshotDetailSidebar from 'in-components/SnapshotDetailSidebar';
import SnapshotsConveyer from 'in-services/conveyer/SnapshotsConveyer';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import NotificationCounter from 'in-components/NotificationCounter';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import ChoosePluginButton from 'in-components/ChoosePluginButton';
// import MapViewSwitcher from 'in-components/MapViewSwitcher';
import AccountMenu from 'in-components/AccountMenu';
import * as constants from 'in-forge/constants';
import Lettering from 'in-components/Lettering';
import helpify from 'in-components/hoc/helpify';
import Sidebar from 'in-components/Sidebar';
import {create} from 'in-services/conveyer';
import Map from 'in-map';

import NotificationCenter from './NotificationCenter';
import ConnectionStatus from './ConnectionStatus';
import FeedbackBadge from './FeedbackBadge';
import HelpDialog from './HelpDialog';
import DemoDialog from './DemoDialog';
import Settings from './Settings';
import Timeline from './Timeline';

import './App.less';

const rpt = React.PropTypes;

const App = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin,
    Navigation,
    IntlMixin
  ],

  propTypes: {
    closeHelpIfOpen: rpt.func.isRequired,
    showHelp: rpt.func.isRequired,
    state: rpt.object.isRequired
  },

  getInitialState() {
    return {
      pluginIds: [constants.plugins.os],
      showSettings: false
    };
  },

  componentDidMount() {
    const subscriptions = this.state.pluginIds.map(pluginId => {
      return create(SnapshotsConveyer, {pluginId});
    });

    this.addSubscription(
      combineLatest(subscriptions).subscribe(snapshotArray => {
        const snapshots = snapshotArray.reduce((a, b) => a.concat(b), Immutable.List());
        if(snapshots.size === 0) {
          this.props.showHelp(203860032);
        } else {
          this.props.closeHelpIfOpen();
        }
      })
    );
  },

  togglePlugin(pluginIds) {
    this.setState({ pluginIds });
  },

  toggleNotificationCenter() {
    this.setState({ showNotificationCenter: !this.state.showNotificationCenter });
  },

  showMenu(show = true) {
    this.setState({ showSettings: show });
  },

  render() {
    const hasChildren = this.props.state.routes.length > 1;

    return (
      <div>
        {this.state.showSettings ? <Settings showMenu={this.showMenu}/> : null }

        <Lettering className='in-root-lettering' />
        {this.renderMenu()}

        {__DEV__ ? <ChoosePluginButton onClick={this.togglePlugin}/> : null}

        <section style={{display: hasChildren ? 'none' : 'block'}}>
          <Map pluginIds={this.state.pluginIds} />
          <Sidebar pluginIds={this.state.pluginIds} />
          <SnapshotDetailSidebar />
          <FeedbackBadge />

          <NotificationCenter toggleNotificationCenter={this.toggleNotificationCenter}
                              open={this.state.showNotificationCenter}/>

        </section>

        <Timeline />
        <RouteHandler />

        {this.props.state.query.help ? <HelpDialog id={this.props.state.query.help} /> : null}

        {window.instana.config.environment === 'demo' ? <DemoDialog /> : null}

        <TooltipPresenter />
        <ConnectionStatus />
      </div>
    );
  },

  renderMenu() {
    return (
      <div className='in-root-menu'>
        <NotificationCounter onClick={this.toggleNotificationCenter}/>
        <AccountMenu showMenu={this.showMenu}/>
      </div>
    );
  }
});

export default helpify(App);
