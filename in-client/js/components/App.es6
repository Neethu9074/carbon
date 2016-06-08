import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import TemporaryNotificationPresenter from 'in-components/TemporaryNotificationPresenter';
import NotificationCenterFlyout from 'in-components/notificationCenter/Flyout';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import HelpPresenter from 'in-components/helpSystem/HelpPresenter';
import ReleaseNotesDialog from 'in-components/ReleaseNotesDialog';
import {showHelp, closeHelpIfOpen} from 'in-stores/navigation';
import SidebarIncidents from 'in-components/sidebars/Incident';
import ConnectionStatus from 'in-components/ConnectionStatus';
import MaintenanceNote from 'in-components/MaintenanceNote';
import MessageDialog from 'in-components/MessageDialog';
import Timeline from 'in-components/timeline/Timeline';
import SidebarMap from 'in-components/sidebars/Map';
import Filterbar from 'in-components/Filterbar';
import AppHeader from 'in-components/AppHeader';
import Settings from 'in-components/Settings';
import {isMonitoring} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';
import Map from 'in-map';

import {notMonitoringDialogShown$, notMonitoringWasShown} from './appStores';

import './App.less';


const rpt = React.PropTypes;

export default
  connectTo({
    notMonitoringDialogShown: notMonitoringDialogShown$,
    isMonitoring
  },
  React.createClass({

    displayName: 'App',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      notMonitoringDialogShown: rpt.bool,
      isMonitoring: rpt.bool,
      children: rpt.any
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
      const hasChildren = this.props.children;

      return (
        <div>
          <AppHeader />

          <section style={{display: hasChildren ? 'none' : 'block'}}>
            <Map />
            <Filterbar />
            <SidebarIncidents />
            <SidebarMap />
          </section>

          <NotificationCenterFlyout />
          <Timeline />

          {this.props.children}

          <Settings />
          <ReleaseNotesDialog />
          <MessageDialog />
          <HelpPresenter />
          <TooltipPresenter />
          <ConnectionStatus />
          <MaintenanceNote />
          <TemporaryNotificationPresenter />
        </div>
      );
    }
  })
);
