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
import MapSidebar from 'in-components/Sidebar/MapSidebar';
import TableView from 'in-components/tableView/TableView';
import MessageDialog from 'in-components/MessageDialog';
import Timeline from 'in-components/timeline/Timeline';
import ViewSwitcher from 'in-components/ViewSwitcher';
import RightSidebar from 'in-components/RightSidebar';
import AppHeader from 'in-components/AppHeader';
import MapNotes from 'in-components/MapNotes';
import Settings from 'in-components/Settings';
import Map from 'in-map';

import './App.less';

export default function App(props) {
  const hasChildren = !!props.children;
  const shouldShowMap = !hasChildren || props.routes[1].showMap;

  return (
    <div>
      <AppHeader />
      <ViewSwitcher />

      <section style={{display: shouldShowMap ? 'block' : 'none'}}>
        <Map />
        <TableView />
        <Center />
        <SidebarIncidents />
        <MapSidebar />
        <MapNotes />
      </section>

      <RightSidebar />
      <Controls />
      <Timeline />

      {props.children}

      <Settings />
      <DetailPopupPresenter />
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
