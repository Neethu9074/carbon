import PureRenderMixin from 'react-addons-pure-render-mixin';
import {RouteHandler, Navigation} from 'react-router';
import {IntlMixin} from 'react-intl';
import React from 'react';

import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import NotificationCounter from 'in-components/NotificationCounter';
import {isInternalEnvironment, isDemoEnvironment} from 'in-services/config';
import MapViewSwitcher from 'in-components/MapViewSwitcher';
import RegisterForBeta from 'in-components/RegisterForBeta';
import AccountMenu from 'in-components/AccountMenu';
import SidebarMap from 'in-components/SidebarMap';
import Lettering from 'in-components/Lettering';
import helpify from 'in-components/hoc/helpify';
import Filterbar from 'in-components/Filterbar';
import {isMonitoring} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';
import Map from 'in-map';

import NavigationAdapter from './NavigationAdapter';
import ConnectionStatus from './ConnectionStatus';
import HelpDialog from './HelpDialog';
import DemoDialog from './DemoDialog';
import Settings from './Settings';
import Timeline from './Timeline';


import './App.less';

const rpt = React.PropTypes;

export default helpify(connectTo(
  () => {
    return {
      isMonitoring
    };
  }, React.createClass({
  displayName: 'App',

  mixins: [
    PureRenderMixin,
    Navigation,
    IntlMixin
  ],

  propTypes: {
    closeHelpIfOpen: rpt.func.isRequired,
    showHelp: rpt.func.isRequired,
    state: rpt.object.isRequired,
    isMonitoring: rpt.bool
  },

  getInitialState() {
    return {
      showSettings: false,
      notMonitoringDialogShownBefore: false
    };
  },

  componentWillMount() {
    this.showNotMonitoringDialogIfNecessary(this.props, this.state);
  },

  componentWillUpdate(nextProps, nextState) {
    this.showNotMonitoringDialogIfNecessary(nextProps, nextState);
  },

  showNotMonitoringDialogIfNecessary(props, state) {
    if (props.isMonitoring === false && state.notMonitoringDialogShownBefore === false) {
      this.setState({
        notMonitoringDialogShownBefore: true
      });
      props.showHelp(203860032);
    } else if (props.isMonitoring === true) {
      props.closeHelpIfOpen(203860032);
    }
  },

  // TODO Ben replace with URL parameter
  showMenu(show = true) {
    this.setState({ showSettings: show });
  },

  render() {
    const hasChildren = this.props.state.routes.length > 1;

    return (
      <div>
        <NavigationAdapter />

        {this.state.showSettings ? <Settings showMenu={this.showMenu}/> : null }

        {isInternalEnvironment() ?
          <MapViewSwitcher />
        : null}

        <Lettering className='in-root-lettering'/>
        <AccountMenu showMenu={this.showMenu}
                     className={'in-root-menu'}/>
        <NotificationCounter className={'in-root-notification-counter'}/>

        <section style={{display: hasChildren ? 'none' : 'block'}}>
          <Map />
          <Filterbar />
          <SidebarMap />
        </section>

        <Timeline />
        <RouteHandler />
        {isDemoEnvironment() ?
          <RegisterForBeta />
        : null}

        {this.props.state.query.help ? <HelpDialog id={this.props.state.query.help} /> : null}

        {isDemoEnvironment() ? <DemoDialog /> : null}

        <TooltipPresenter />
        <ConnectionStatus />
      </div>
    );
  }
})));
