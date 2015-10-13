import {RouteHandler, Navigation} from 'react-router';
import {IntlMixin} from 'react-intl';
import React from 'react/addons';

import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import NotificationCounter from 'in-components/NotificationCounter';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import ChoosePluginButton from 'in-components/ChoosePluginButton';
import * as viewStructureStore from 'in-services/stores/view';
import MapViewSwitcher from 'in-components/MapViewSwitcher';
import AccountMenu from 'in-components/AccountMenu';
import * as constants from 'in-forge/constants';
import Lettering from 'in-components/Lettering';
import helpify from 'in-components/hoc/helpify';
import Filterbar from 'in-components/Filterbar';
import SidebarMap from 'in-components/SidebarMap';
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
    this.addSubscription(
      viewStructureStore.viewStructure.subscribe(viewStructure => {
        if (viewStructure.length === 0) {
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

        <MapViewSwitcher className='in-root-map-switcher' />
        <Lettering className='in-root-lettering' />
        {this.renderMenu()}

        {__DEV__ ? <ChoosePluginButton onClick={this.togglePlugin}/> : null}

        <section style={{display: hasChildren ? 'none' : 'block'}}>
          <Map />
          <Filterbar />
          <SidebarMap />
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
