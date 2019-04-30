import React from 'react';

import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import HelpPresenter from 'in-components/helpSystem/HelpPresenter';
import ReleaseNotesDialog from 'in-components/ReleaseNotesDialog';
import MainNavigation from 'in-new-components/MainNavigation';
import DialogPresenter from 'in-components/DialogPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import MessageFlyout from 'in-components/MessageFlyout';
import MessageDialog from 'in-components/MessageDialog';

import routes from 'in-client/js/routes/mainRoutes';

import 'in-themes/foundation.less';
import locals from './App.mless';

export default function App() {
  return (
    <ErrorBoundary name="app">
      <ErrorBoundary name="main-navigation">
        <MainNavigation />
      </ErrorBoundary>

      <div className={locals.content}>
        <ErrorBoundary name="app-routes">{routes}</ErrorBoundary>
      </div>

      <ErrorBoundary name="dialogs">
        {/* for release notes */}
        <ReleaseNotesDialog />

        {/* for backend send messages */}
        <MessageDialog />

        {/* help articles */}
        <HelpPresenter />

        <TooltipPresenter />

        <OverlayPresenter />

        {/* the flyouts on the top right corner */}
        <MessageFlyout />

        {/* all the different dialogs e.g. in the settings */}
        <DialogPresenter />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}
