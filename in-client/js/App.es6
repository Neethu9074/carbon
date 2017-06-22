import React from 'react';

import DetailPopupPresenter from 'in-components/DetailPopupPresenter/DetailPopupPresenter';
import TemporaryNotificationPresenter from 'in-components/TemporaryNotificationPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import HelpPresenter from 'in-components/helpSystem/HelpPresenter';
import ReleaseNotesDialog from 'in-components/ReleaseNotesDialog';
import ConnectionStatus from 'in-components/ConnectionStatus';
import DialogPresenter from 'in-components/DialogPresenter';
import DeveloperPanel from 'in-components/DeveloperPanel';
import MessageFlyout from 'in-components/MessageFlyout';
import MessageDialog from 'in-components/MessageDialog';
import Timeline from 'in-components/timeline/Timeline';
import SearchBar from 'in-components/SearchBar';
import AppHeader from 'in-components/AppHeader';

import routes from 'in-client/js/routes/mainRoutes';

import './App.less';

export default function App() {
  return (
    <div>
      <AppHeader />
      <SearchBar />
      <Timeline />
      <DetailPopupPresenter />
      <ReleaseNotesDialog />
      <MessageDialog />
      <HelpPresenter />
      <TooltipPresenter />
      <ConnectionStatus />
      <MessageFlyout />
      <TemporaryNotificationPresenter />
      <DialogPresenter />
      {__DEV__ ? <DeveloperPanel /> : null}

      {routes}

    </div>
  );
}
