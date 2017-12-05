import React from 'react';

import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import HelpPresenter from 'in-components/helpSystem/HelpPresenter';
import ReleaseNotesDialog from 'in-components/ReleaseNotesDialog';
import DialogPresenter from 'in-components/DialogPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import MessageFlyout from 'in-components/MessageFlyout';
import MessageDialog from 'in-components/MessageDialog';
import Timeline from 'in-components/timeline/Timeline';
import AppHeader from 'in-components/AppHeader';
import Sticky from 'in-components/Sticky';

import routes from 'in-client/js/routes/mainRoutes';

import './App.less';

export default function App() {
  return (
    <ErrorBoundary name="app">
      <Sticky
        header={
          <ErrorBoundary name="app-header">
            <AppHeader />
          </ErrorBoundary>
        }
      >
        <ErrorBoundary name="app-routes">{routes}</ErrorBoundary>
      </Sticky>

      <ErrorBoundary name="timeline">
        <Timeline />
      </ErrorBoundary>

      <ErrorBoundary name="dialogs">
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
      </ErrorBoundary>
    </ErrorBoundary>
  );
}
