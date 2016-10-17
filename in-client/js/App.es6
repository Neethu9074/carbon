import React from 'react';

import DetailPopupPresenter from 'in-components/DetailPopupPresenter/DetailPopupPresenter';
import TemporaryNotificationPresenter from 'in-components/TemporaryNotificationPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import HelpPresenter from 'in-components/helpSystem/HelpPresenter';
import ReleaseNotesDialog from 'in-components/ReleaseNotesDialog';
import ConnectionStatus from 'in-components/ConnectionStatus';
import DialogPresenter from 'in-components/DialogPresenter';
import MessageFlyout from 'in-components/MessageFlyout';
import MessageDialog from 'in-components/MessageDialog';
import Timeline from 'in-components/timeline/Timeline';
import ViewSwitcher from 'in-components/ViewSwitcher';
import AppHeader from 'in-components/AppHeader';
import Settings from 'in-components/Settings';

import './App.less';

export default function App(props) {
  return (
    <div>
      <AppHeader />
      <ViewSwitcher />
      <Timeline />

      {props.children}

      <Settings />
      <DetailPopupPresenter />
      <ReleaseNotesDialog />
      <MessageDialog />
      <HelpPresenter />
      <TooltipPresenter />
      <ConnectionStatus />
      <MessageFlyout />
      <TemporaryNotificationPresenter />
      <DialogPresenter />
    </div>
  );
}
