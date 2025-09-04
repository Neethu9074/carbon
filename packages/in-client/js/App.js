/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ThemeProvider } from '@instana/components';

import {
  applicationsAccessPermissions,
  automationAccessPermissions,
  bizopsAccessPermissions,
  eventsAccessPermissions,
  infrastructureAccessPermissions,
  infrastructureAnalyzeAccessPermissions,
  kubernetesAccessPermissions,
  linuxKVMHypervisorAccessPermissions,
  mobileAppsAccessPermissions,
  nutanixAccessPermissions,
  openStackAccessPermissions,
  pcfAccessPermissions,
  phmcAccessPermissions,
  powerVcAccessPermissions,
  sapAccessPermissions,
  sloAccessPermissions,
  syntheticsAccessPermissions,
  vSphereAccessPermissions,
  websitesAccessPermissions,
  windowsHypervisorAccessPermissions,
  xenServerAccessPermissions,
  zhmcAccessPermissions
} from 'in-stores/permission';
import {
  playwithEnabled,
  timeOutSessionEnabled,
  solisEnabled,
  solisInstanaNativeShellEnabled,
  infraExploreDataEnabled,
  syntheticsEnabled,
  vsphereEnabled,
  phmcEnabled,
  powervcEnabled,
  windowsHypervisorEnabled,
  zhmcEnabled,
  pcfEnabled,
  openstackEnabled,
  sapEnabled,
  nutanixEnabled,
  xenserverEnabled,
  linuxKVMHypervisorEnabled,
  sloFullEnabled,
  businessObservabilityEnabled,
  actionAutomationEnabled
} from 'in-services/featureFlags';
import FloatingActionButtonPresenter from 'in-components/FloatingActionButton/FloatingActionButtonPresenter';
import { CustomTopNavItemListener } from 'in-components/SolisListeners/CustomTopNavItemListener';
import SessionTimeoutContainer from 'in-components/SessionTimeoutDialog/SessionTimeoutContainer';
import DeprecatedCustomEventsPopUp from 'in-events/components/DeprecatedCustomEventsPopUp';
import LocationStateProvider from 'in-stores/navigation/LocationStateProvider';
import { TourListener } from 'in-plg/components/SolisHelpPanel/TourListener';
import ScrollTrackingWrapper from 'in-components/ScrollTrackingWrapper';
import OverlayPresenter from 'in-components/overlays/OverlayPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import CarbonUIShell from 'in-client/js/CarbonUIShell/CarbonUIShell';
import { GlobalTimeConfig } from 'in-stores/time/TimeConfigContext';
import ReleaseNotesDialog from 'in-components/ReleaseNotesDialog';
import { PERMISSION_STRATEGY } from 'in-stores/useHasPermission';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import DialogPresenter from 'in-components/DialogPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import MessageFlyout from 'in-components/MessageFlyout';
import useHasAccesses from 'in-stores/useHasAccesses';
import routes from 'in-client/js/routes/mainRoutes';
import useHasAccess from 'in-stores/useHasAccess';
import GlobalTheme from 'in-themes/GlobalTheme';

import locals from './App.mless';

export default function App() {
  window.RUNTIME_CONTEXT = solisEnabled ? 'solis' : 'standalone';
  const [role] = useCurrentUserRole();

  const hasApplicationsAccess = useHasAccess({ requiredPermissions: applicationsAccessPermissions });
  const hasBizOpsAccess = useHasAccess({
    optionalPrecondition: businessObservabilityEnabled,
    requiredPermissions: bizopsAccessPermissions
  });
  const hasWebsitesAccess = useHasAccess({ requiredPermissions: websitesAccessPermissions });
  const hasKubernetesAccess = useHasAccess({ requiredPermissions: kubernetesAccessPermissions });
  const hasMobileAppsAccess = useHasAccess({ requiredPermissions: mobileAppsAccessPermissions });
  const hasInfrastructureAccess = useHasAccess({ requiredPermissions: infrastructureAccessPermissions });
  const hasSyntheticsAccess = useHasAccess({
    optionalPrecondition: syntheticsEnabled,
    requiredPermissions: syntheticsAccessPermissions
  });
  const hasVSphereAccess = useHasAccess({
    optionalPrecondition: vsphereEnabled,
    requiredPermissions: vSphereAccessPermissions
  });
  const hasPowerVcAccess = useHasAccess({
    optionalPrecondition: powervcEnabled,
    requiredPermissions: powerVcAccessPermissions
  });
  const hasPHMCAccess = useHasAccess({
    optionalPrecondition: phmcEnabled,
    requiredPermissions: phmcAccessPermissions
  });
  const hasZHMCAccess = useHasAccess({
    optionalPrecondition: zhmcEnabled,
    requiredPermissions: zhmcAccessPermissions
  });
  const hasPCFAccess = useHasAccess({
    optionalPrecondition: pcfEnabled,
    requiredPermissions: pcfAccessPermissions
  });
  const hasOpenStackAccess = useHasAccess({
    optionalPrecondition: openstackEnabled,
    requiredPermissions: openStackAccessPermissions
  });
  const hasEventsAccess = useHasAccesses({
    requiredPermissions: eventsAccessPermissions,
    strategy: PERMISSION_STRATEGY.REQUIRE_ANY
  });
  const hasSAPAccess = useHasAccess({
    optionalPrecondition: sapEnabled,
    requiredPermissions: sapAccessPermissions
  });
  const hasSloAccess = useHasAccesses({
    optionalPrecondition: sloFullEnabled,
    requiredPermissions: sloAccessPermissions,
    strategy: PERMISSION_STRATEGY.REQUIRE_ANY
  });
  const hasAutomationAccess = useHasAccess({
    optionalPrecondition: actionAutomationEnabled,
    requiredPermissions: automationAccessPermissions
  });
  const hasNutanixAccess = useHasAccess({
    optionalPrecondition: nutanixEnabled,
    requiredPermissions: nutanixAccessPermissions
  });
  const hasXenServerAccess = useHasAccess({
    optionalPrecondition: xenserverEnabled,
    requiredPermissions: xenServerAccessPermissions
  });
  const hasWindowsHypervisorAccess = useHasAccess({
    optionalPrecondition: windowsHypervisorEnabled,
    requiredPermissions: windowsHypervisorAccessPermissions
  });
  const hasLinuxKVMHypervisorAccess = useHasAccess({
    optionalPrecondition: linuxKVMHypervisorEnabled,
    requiredPermissions: linuxKVMHypervisorAccessPermissions
  });
  const hasInfrastructureAnalyzeAccess = useHasAccess({
    optionalPrecondition: infraExploreDataEnabled,
    requiredPermissions: infrastructureAnalyzeAccessPermissions
  });

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
          <ThemeProvider>
            <ScrollTrackingWrapper>
              <GlobalTimeConfig>
                <ErrorBoundary name="main-navigation">
                  {solisEnabled && !solisInstanaNativeShellEnabled ? (
                    <>
                      <solis-nav />
                      {/**   when rendering in solis context, there will be no instana native shell
                      but in this case, there will be event handlers for communicating
                      with solis nav */}
                      <TourListener />
                      <CustomTopNavItemListener />
                    </>
                  ) : (
                    <CarbonUIShell />
                  )}
                </ErrorBoundary>
                <div className={locals.content} role="main">
                  {/* For "Skip to main content" target */}
                  <div tabIndex={-1} id="main-content" style={{ display: 'hidden' }} />
                  <ErrorBoundary name="app-routes">
                    {routes({
                      role,
                      hasApplicationsAccess,
                      hasAutomationAccess,
                      hasBizOpsAccess,
                      hasEventsAccess,
                      hasInfrastructureAccess,
                      hasKubernetesAccess,
                      hasLinuxKVMHypervisorAccess,
                      hasMobileAppsAccess,
                      hasNutanixAccess,
                      hasOpenStackAccess,
                      hasPCFAccess,
                      hasPHMCAccess,
                      hasPowerVcAccess,
                      hasSAPAccess,
                      hasSloAccess,
                      hasSyntheticsAccess,
                      hasVSphereAccess,
                      hasWebsitesAccess,
                      hasWindowsHypervisorAccess,
                      hasXenServerAccess,
                      hasZHMCAccess,
                      hasInfrastructureAnalyzeAccess
                    })}
                  </ErrorBoundary>
                </div>

                <ErrorBoundary name="dialogs">
                  {/* for release notes */}
                  <ReleaseNotesDialog />
                  {timeOutSessionEnabled && <SessionTimeoutContainer />}
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
