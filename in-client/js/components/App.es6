import PureRenderMixin from 'react-addons-pure-render-mixin';
import {RouteHandler} from 'react-router';
import React from 'react';

import TemporaryNotificationPresenter from 'in-components/TemporaryNotificationPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import NotificationCounter from 'in-components/NotificationCounter';
import {showHelp, closeHelpIfOpen} from 'in-stores/navigation';
import SidebarIncidents from 'in-components/SidebarIncidents';
import MapViewSwitcher from 'in-components/MapViewSwitcher';
import RegisterForBeta from 'in-components/RegisterForBeta';
import MessageDialog from 'in-components/MessageDialog';
import Timeline from 'in-components/timeline/Timeline';
import {isDemoEnvironment} from 'in-services/config';
import AccountMenu from 'in-components/AccountMenu';
import SidebarMap from 'in-components/SidebarMap';
import Lettering from 'in-components/Lettering';
import Filterbar from 'in-components/Filterbar';
import {isMonitoring} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';
import Map from 'in-map';

import NavigationAdapter from './NavigationAdapter';
import ConnectionStatus from './ConnectionStatus';
import HelpDialog from './HelpDialog';
import DemoDialog from './DemoDialog';
import Settings from './Settings';

import {
  notMonitoringDialogShown$,
  setSettingsVisibility,
  notMonitoringWasShown,
  showSettings$
} from './appStores';

import './App.less';


const rpt = React.PropTypes;

export default
  connectTo({
    notMonitoringDialogShown: notMonitoringDialogShown$,
    showSettings: showSettings$,
    isMonitoring
  },
  React.createClass({

    displayName: 'App',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      notMonitoringDialogShown: rpt.bool,
      state: rpt.object.isRequired,
      showSettings: rpt.bool,
      isMonitoring: rpt.bool
    },

    componentWillMount() {
      this.showNotMonitoringDialogIfNecessary(this.props);
    },

    componentWillUpdate(nextProps, nextState) {
      this.showNotMonitoringDialogIfNecessary(nextProps, nextState);
    },

    showNotMonitoringDialogIfNecessary(props) {
      if (props.isMonitoring === false && props.notMonitoringDialogShown === false) {
        notMonitoringWasShown();
        showHelp(203860032);
      } else if (props.isMonitoring) {
        closeHelpIfOpen(203860032);
      }
    },

    render() {
      const activePath = this.props.state.routes.map(route => route.name);
      const hasChildren = this.props.state.routes.length > 1;

      return (
        <div>
          <NavigationAdapter />

          {this.props.showSettings ? <Settings showMenu={setSettingsVisibility}/> : null }

          <MapViewSwitcher activePath={activePath} />

          <Lettering className='in-root-lettering'/>
          <AccountMenu showMenu={setSettingsVisibility}
                       className={'in-root-menu'}/>
          <NotificationCounter className={'in-root-notification-counter'}/>

          <section style={{display: hasChildren ? 'none' : 'block'}}>
            <Map />
            <Filterbar />
            <SidebarIncidents />
            <SidebarMap />
          </section>

          <Timeline />
          <RouteHandler />

          {isDemoEnvironment() ?
            <RegisterForBeta />
          : null}

          {this.props.state.query.help ? <HelpDialog id={this.props.state.query.help} /> : null}

          {isDemoEnvironment() ? <DemoDialog /> : null}

          <MessageDialog />
          <TooltipPresenter />
          <ConnectionStatus />
          <TemporaryNotificationPresenter />
        </div>
      );
    }
  })
);
