/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useLocation } from 'react-router';
import React from 'react';

import '@instana/components/esm/index.css';

import FloatingActionButtonPresenter from 'in-components/FloatingActionButton/FloatingActionButtonPresenter';
import OverlayPresenter from 'in-components/overlays/OverlayPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import { GlobalTimeConfig } from 'in-stores/time/TimeConfigContext';
import ReleaseNotesDialog from 'in-components/ReleaseNotesDialog';
import DialogPresenter from 'in-components/DialogPresenter';
import MainNavigation from 'in-components/MainNavigation';
import ErrorBoundary from 'in-components/ErrorBoundary';
import MessageFlyout from 'in-components/MessageFlyout';
import routes from 'in-client/js/routes/mainRoutes';
import GlobalTheme from 'in-themes/GlobalTheme';

import 'in-themes/foundation.less';
import locals from './App.mless';

export default function App() {
  const location = useLocation();

  return (
    <ErrorBoundary name="app">
      <GlobalTheme>
        <GlobalTimeConfig location={location}>
          <ErrorBoundary name="main-navigation">
            <MainNavigation />
          </ErrorBoundary>

          <div className={locals.content}>
            <ErrorBoundary name="app-routes">{routes}</ErrorBoundary>
          </div>

          <ErrorBoundary name="dialogs">
            {/* for release notes */}
            <ReleaseNotesDialog />
            <TooltipPresenter />
            <OverlayPresenter />
            {/* the flyouts on the top right corner */}
            <MessageFlyout />
            {/* all the different dialogs e.g. in the settings */}
            <DialogPresenter />
          </ErrorBoundary>

          <ErrorBoundary name="floatinButtons">
            {/* floating action buttons at the bottom of the screen */}
            <FloatingActionButtonPresenter />
          </ErrorBoundary>
        </GlobalTimeConfig>
      </GlobalTheme>
    </ErrorBoundary>
  );
}
