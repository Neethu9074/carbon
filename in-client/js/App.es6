/* global require:false */
import React from 'react';

import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import HelpPresenter from 'in-components/helpSystem/HelpPresenter';
import ReleaseNotesDialog from 'in-components/ReleaseNotesDialog';
import DialogPresenter from 'in-components/DialogPresenter';
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

      {/* for release notes */}
      <ReleaseNotesDialog />

      {/* for backend send messages */}
      <MessageDialog />

      {/* help articles */}
      <HelpPresenter />

      <TooltipPresenter />

      {/* the flyouts on the top right corner */}
      <MessageFlyout />

      {/* all the different dialogs e.g. in the settings */}
      <DialogPresenter />

      {__DEV__ ? getDevPanel() : null}

      {routes}

    </div>
  );
}

function getDevPanel() {
  const DeveloperPanel = require('in-components/DeveloperPanel/DeveloperPanel.es6').default;
  return <DeveloperPanel />;
}
