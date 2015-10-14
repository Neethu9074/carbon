import {RouteHandler, Navigation} from 'react-router';
import {IntlMixin} from 'react-intl';
import React from 'react/addons';

import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import NotificationCounter from 'in-components/NotificationCounter';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import * as viewStructureStore from 'in-services/stores/view';
import MapViewSwitcher from 'in-components/MapViewSwitcher';
import {isDemoEnvironment} from 'in-services/config';
import AccountMenu from 'in-components/AccountMenu';
import SidebarMap from 'in-components/SidebarMap';
import * as constants from 'in-forge/constants';
import Lettering from 'in-components/Lettering';
import helpify from 'in-components/hoc/helpify';
import Filterbar from 'in-components/Filterbar';
import Map from 'in-map';

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

  showMenu(show = true) {
    this.setState({ showSettings: show });
  },

  render() {
    const hasChildren = this.props.state.routes.length > 1;

    return (
      <div>
        {this.state.showSettings ? <Settings showMenu={this.showMenu}/> : null }

        {!isDemoEnvironment() ? <MapViewSwitcher className='in-root-map-switcher'/> : null}
        <Lettering className='in-root-lettering'/>
        <AccountMenu showMenu={this.showMenu}
                     className={'in-root-menu'}/>
        <NotificationCounter className={'in-root-notification-counter'}/>

        <section style={{display: hasChildren ? 'none' : 'block'}}>
          <Map />
          <Filterbar />
          <SidebarMap />
          <FeedbackBadge />
        </section>

        <Timeline />
        <RouteHandler />

        {this.props.state.query.help ? <HelpDialog id={this.props.state.query.help} /> : null}

        {window.instana.config.environment === 'demo' ? <DemoDialog /> : null}

        <TooltipPresenter />
        <ConnectionStatus />
      </div>
    );
  }
});

export default helpify(App);
