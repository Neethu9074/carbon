import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import TemporaryNotificationPresenter from 'in-components/TemporaryNotificationPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import NotificationCounter from 'in-components/NotificationCounter';
import HelpPresenter from 'in-components/helpSystem/HelpPresenter';
import {showHelp, closeHelpIfOpen} from 'in-stores/navigation';
import SidebarIncidents from 'in-components/SidebarIncidents';
import MapViewSwitcher from 'in-components/MapViewSwitcher';
import MessageDialog from 'in-components/MessageDialog';
import Timeline from 'in-components/timeline/Timeline';
import AccountMenu from 'in-components/AccountMenu';
import SidebarMap from 'in-components/SidebarMap';
import Lettering from 'in-components/Lettering';
import Filterbar from 'in-components/Filterbar';
import {isMonitoring} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';
import Map from 'in-map';

import ConnectionStatus from './ConnectionStatus';
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
      showSettings: rpt.bool,
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
          {this.props.showSettings ? <Settings showMenu={setSettingsVisibility}/> : null }

          <MapViewSwitcher />

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

          {this.props.children}


          <MessageDialog />
          <HelpPresenter />
          <TooltipPresenter />
          <ConnectionStatus />
          <TemporaryNotificationPresenter />
        </div>
      );
    }
  })
);
