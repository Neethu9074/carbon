import React from 'react';

import DetailPopupPresenter from 'in-components/DetailPopupPresenter/DetailPopupPresenter';
import TemporaryNotificationPresenter from 'in-components/TemporaryNotificationPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import Controls from 'in-components/RightSidebar/components/Controls';
import Center from 'in-components/notificationCenter/Center/Center';
import HelpPresenter from 'in-components/helpSystem/HelpPresenter';
import ReleaseNotesDialog from 'in-components/ReleaseNotesDialog';
import SidebarIncidents from 'in-components/sidebars/Incident';
import ConnectionStatus from 'in-components/ConnectionStatus';
import MaintenanceNote from 'in-components/MaintenanceNote';
import TableView from 'in-components/tableView/TableView';
import MessageDialog from 'in-components/MessageDialog';
import Timeline from 'in-components/timeline/Timeline';
import RightSidebar from 'in-components/RightSidebar';
import SidebarMap from 'in-components/sidebars/Map';
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
        <Center />
        <SidebarIncidents />
        <SidebarMap />
        <DetailPopupPresenter />
      </section>

      <RightSidebar />
      <Controls />
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
