import React from 'react';

import TemporaryNotificationPresenter from 'in-components/TemporaryNotificationPresenter';
import NotificationCenterFlyout from 'in-components/notificationCenter/Flyout';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import HelpPresenter from 'in-components/helpSystem/HelpPresenter';
import ReleaseNotesDialog from 'in-components/ReleaseNotesDialog';
import SidebarIncidents from 'in-components/sidebars/Incident';
import ConnectionStatus from 'in-components/ConnectionStatus';
import MaintenanceNote from 'in-components/MaintenanceNote';
import TableView from 'in-components/tableView/TableView';
import MessageDialog from 'in-components/MessageDialog';
import Timeline from 'in-components/timeline/Timeline';
import SidebarMap from 'in-components/sidebars/Map';
import Filterbar from 'in-components/Filterbar';
import AppHeader from 'in-components/AppHeader';
import Settings from 'in-components/Settings';
import Map from 'in-map';

import './App.less';

export default function App({children = null}) {
  const hasChildren = !!children;

  return (
    <div>
      <AppHeader />

      <section style={{display: hasChildren ? 'none' : 'block'}}>
        <Map />
        <TableView />
        <Filterbar />
        <SidebarIncidents />
        <SidebarMap />
      </section>

      <NotificationCenterFlyout />
      <Timeline />

      {children}

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
