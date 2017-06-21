import React from 'react';

import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import HelpPresenter from 'in-components/helpSystem/HelpPresenter';
import ReleaseNotesDialog from 'in-components/ReleaseNotesDialog';
import DialogPresenter from 'in-components/DialogPresenter';
import { setWindowTitleFromRoute } from 'in-services/title';
import DeveloperPanel from 'in-components/DeveloperPanel';
import MessageFlyout from 'in-components/MessageFlyout';
import MessageDialog from 'in-components/MessageDialog';
import Timeline from 'in-components/timeline/Timeline';
import SearchBar from 'in-components/SearchBar';
import AppHeader from 'in-components/AppHeader';

import './App.less';

export default function App(props) {
  if (props.routes && props.routes.length > 0) {
    setWindowTitleFromRoute(props.routes[props.routes.length - 1].windowTitle);
  } else {
    setWindowTitleFromRoute('Welcome');
  }

  return (
    <div>
      <AppHeader />
      <SearchBar />
      <Timeline />

      {/* for release notes */}
      <ReleaseNotesDialog />

      {/* for backend send messages */}
      <MessageDialog />

      {/* help articles */}
      <HelpPresenter />

      <TooltipPresenter />

      {/* the flyouts on the top right corner */}
      <MessageFlyout />

      <DialogPresenter />

      {__DEV__ ? <DeveloperPanel /> : null}

      {props.children}
    </div>
  );
}
