/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ThemeProvider, getThemeOverride } from '@instana/components';

import FloatingActionButtonPresenter from 'in-components/FloatingActionButton/FloatingActionButtonPresenter';
import DeprecatedCustomEventsPopUp from 'in-events/components/DeprecatedCustomEventsPopUp';
import CarbonUIShell from 'in-components/MainNavigation/components/CarbonUIShell';
import LocationStateProvider from 'in-stores/navigation/LocationStateProvider';
import ScrollTrackingWrapper from 'in-components/ScrollTrackingWrapper';
import OverlayPresenter from 'in-components/overlays/OverlayPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import { GlobalTimeConfig } from 'in-stores/time/TimeConfigContext';
import ReleaseNotesDialog from 'in-components/ReleaseNotesDialog';
import DialogPresenter from 'in-components/DialogPresenter';
import { playwithEnabled } from 'in-services/featureFlags';
import ErrorBoundary from 'in-components/ErrorBoundary';
import MessageFlyout from 'in-components/MessageFlyout';
import routes from 'in-client/js/routes/mainRoutes';
import GlobalTheme from 'in-themes/GlobalTheme';

import locals from './App.mless';

export default function App() {
  const currentTheme = getThemeOverride() ?? 'default';
  return (
    <ErrorBoundary name="app">
      <LocationStateProvider>
        {
          // GlobalTheme was the first attempt to introduce theming.
          // It was implemented to support and using theming in QueryBuilder components.
          // It just holds a string:  'light'(default) or 'dark'
          //
          // TODO investigate for usages and decide if it can be completely be removed.
        }
        <GlobalTheme>
          <ThemeProvider theme={currentTheme}>
            <ScrollTrackingWrapper>
              <GlobalTimeConfig>
                <ErrorBoundary name="main-navigation">
                  <CarbonUIShell />
                </ErrorBoundary>

                <div className={locals.content} role="main">
                  {/* For "Skip to main content" target */}
                  <div tabIndex={-1} id="main-content" style={{ display: 'hidden' }} />
                  <ErrorBoundary name="app-routes">{routes}</ErrorBoundary>
                </div>

                <ErrorBoundary name="dialogs">
                  {/* for release notes */}
                  <ReleaseNotesDialog />
                  {/* for hints about deprecations, and required actions */}
                  <DeprecatedCustomEventsPopUp />
                  <TooltipPresenter />
                  <OverlayPresenter />
                  {/* the flyouts on the top right corner */}
                  <MessageFlyout />
                  {/* all the different dialogs e.g. in the settings */}
                  <DialogPresenter />
                </ErrorBoundary>

                <ErrorBoundary name="floatinButtons">
                  {/* floating action buttons at the bottom of the screen */}
                  {!playwithEnabled && <FloatingActionButtonPresenter />}
                </ErrorBoundary>
              </GlobalTimeConfig>
            </ScrollTrackingWrapper>
          </ThemeProvider>
        </GlobalTheme>
      </LocationStateProvider>
    </ErrorBoundary>
  );
}
