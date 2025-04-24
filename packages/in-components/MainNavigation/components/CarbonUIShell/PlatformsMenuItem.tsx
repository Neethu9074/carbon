/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem, SideNavMenu, SvgIcon } from '@instana/components';

import {
  hasKubernetesAccess,
  hasNutanixAccess,
  hasOpenStackAccess,
  hasPCFAccess,
  hasPHMCAccess,
  hasPowerVcAccess,
  hasSAPAccess,
  hasVSphereAccess,
  hasZHMCAccess,
  hasXenServerAccess,
  hasWindowsHypervisorAccess
} from 'in-stores/permission';
// @ts-expect-error no declaration file
import { sap, sapSystemListFullyQualified as sapSystemList } from 'in-sap/navigation/paths';
import {
  cloudfoundry,
  applicationListFullyQualified as cloudfoundryApplicationList
} from 'in-cloudfoundry/navigation/paths';
// @ts-expect-error needs ts migration
import { openstack, regionListFullyQualified } from 'in-openstack/navigation/paths';
import { windowsHypervisor, windowsHypervisorHostListFullyQualified } from 'in-windowshypervisor/navigation/paths';
import { kubernetes, clusterListFullyQualified as kubernetesClusterList } from 'in-kubernetes/navigation/paths';
// @ts-expect-error needs ts migration
import { ibmp, phmcListFullyQualified } from 'in-phmc/navigation/paths';
import { xenserver, xenserverHostListFullyQualified } from 'in-xenserver/navigation/paths';
import { nutanix, nutanixClusterListFullyQualified } from 'in-nutanix/navigation/paths';
import { powervc, powervcRegionListFullyQualified } from 'in-powervc/navigation/paths';
import { datacenterListFullyQualified, vsphere } from 'in-vsphere/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { ibmz, zhmcListFullyQualified } from 'in-zhmc/navigation/paths';
import { playwithEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

const shouldRenderPCFA = hasPCFAccess;
const shouldRenderPHMCA = hasPHMCAccess && !playwithEnabled;
const shouldRenderPowerVc = hasPowerVcAccess && !playwithEnabled;
const shouldRenderZHMCA = hasZHMCAccess && !playwithEnabled;
const shouldRenderOpenStack = hasOpenStackAccess && !playwithEnabled;
const shouldRenderKubernetes = hasKubernetesAccess;
const shouldRenderNutanix = hasNutanixAccess && !playwithEnabled;
const shouldRenderSap = hasSAPAccess && !playwithEnabled;
const shouldRenderVSphere = hasVSphereAccess && !playwithEnabled;
const shouldRenderXenServer = hasXenServerAccess && !playwithEnabled;
const shouldRenderWindowsHypervisor = hasWindowsHypervisorAccess && !playwithEnabled;

const numberOfAllowedPlatforms = [
  shouldRenderPCFA,
  shouldRenderPHMCA,
  shouldRenderPowerVc,
  shouldRenderZHMCA,
  shouldRenderOpenStack,
  shouldRenderKubernetes,
  shouldRenderNutanix,
  shouldRenderSap,
  shouldRenderVSphere,
  shouldRenderXenServer,
  shouldRenderWindowsHypervisor
].filter(Boolean).length;

interface PlatformsMenuItemProps {
  isSideNavExpanded: boolean;
}

export default function PlatformsMenuItem({ isSideNavExpanded }: PlatformsMenuItemProps) {
  if (numberOfAllowedPlatforms === 0) return null;

  if (numberOfAllowedPlatforms === 1) return <PlatformsMenuItemContent icon="lib_platforms_inverted" />;

  return <PlatformsSideNavMenuItem isSideNavExpanded={isSideNavExpanded} />;
}

interface PlatformsSideNavMenuItemProps {
  isSideNavExpanded: boolean;
}

function PlatformsSideNavMenuItem({ isSideNavExpanded }: PlatformsSideNavMenuItemProps) {
  const { matchLocation } = useNavigation();

  const isActive = matchLocation(
    cloudfoundry,
    ibmp,
    powervc,
    ibmz,
    openstack,
    kubernetes,
    nutanix,
    sap,
    vsphere,
    windowsHypervisor,
    xenserver
  );

  return (
    <SideNavMenu
      isSideNavExpanded={isSideNavExpanded}
      renderIcon={() => <SvgIcon color="white" size="s" type="lib_platforms_inverted" />}
      title={t('in-components:mainNavigation.viewSwitcherLabelPlatforms')}
      isActive={isActive}
    >
      <PlatformsMenuItemContent />
    </SideNavMenu>
  );
}

interface PlatformsMenuItemContentProps {
  icon?: string;
}
function PlatformsMenuItemContent(props: PlatformsMenuItemContentProps) {
  const { matchLocation, createHrefToPath } = useNavigation();

  return (
    <>
      {shouldRenderPCFA && (
        <MenuItem
          {...props}
          id="main-nav-cloudfoundry"
          key="main-nav-cloudfoundry"
          label={t('in-components:mainNavigation.viewSwitcherLabelCloudFoundry')}
          href={createHrefToPath(cloudfoundryApplicationList)}
          isActive={matchLocation(cloudfoundry)}
        />
      )}
      {shouldRenderPHMCA && (
        <MenuItem
          {...props}
          id="main-nav-phmc"
          key="main-nav-phmc"
          label={t('in-components:mainNavigation.viewSwitcherLabelphmc')}
          href={createHrefToPath(phmcListFullyQualified)}
          isActive={matchLocation(ibmp)}
        />
      )}
      {shouldRenderPowerVc && (
        <MenuItem
          {...props}
          id="main-nav-powervc"
          key="main-nav-powervc"
          label={t('in-components:mainNavigation.viewSwitcherLabelPowervc')}
          href={createHrefToPath(powervcRegionListFullyQualified)}
          isActive={matchLocation(powervc)}
        />
      )}
      {shouldRenderZHMCA && (
        <MenuItem
          {...props}
          id="main-nav-zhmc"
          key="main-nav-zhmc"
          label={t('in-components:mainNavigation.viewSwitcherLabelzhmc')}
          href={createHrefToPath(zhmcListFullyQualified)}
          isActive={matchLocation(ibmz)}
        />
      )}
      {shouldRenderOpenStack && (
        <MenuItem
          {...props}
          id="main-nav-openstack"
          key="main-nav-openstack"
          label={t('in-components:mainNavigation.viewSwitcherLabelOpenstack')}
          href={createHrefToPath(regionListFullyQualified)}
          isActive={matchLocation(openstack)}
        />
      )}
      {shouldRenderKubernetes && (
        <MenuItem
          {...props}
          id="main-nav-kubernetes"
          key="main-nav-kubernetes"
          label={t('in-components:mainNavigation.viewSwitcherLabelKubernetes')}
          href={createHrefToPath(kubernetesClusterList)}
          isActive={matchLocation(kubernetes)}
        />
      )}
      {shouldRenderNutanix && (
        <MenuItem
          {...props}
          id="main-nav-nutanix"
          key="main-nav-nutanix"
          label={t('in-components:mainNavigation.viewSwitcherLabelNutanix')}
          href={createHrefToPath(nutanixClusterListFullyQualified)}
          isActive={matchLocation(nutanix)}
        />
      )}
      {shouldRenderSap && (
        <MenuItem
          {...props}
          id="main-nav-sap"
          key="main-nav-sap"
          label={t('in-components:mainNavigation.viewSwitcherLabelSap')}
          href={createHrefToPath(sapSystemList)}
          isActive={matchLocation(sap)}
        />
      )}
      {shouldRenderVSphere && (
        <MenuItem
          {...props}
          id="main-nav-vsphere"
          key="main-nav-vsphere"
          label={t('in-components:mainNavigation.viewSwitcherLabelvSphere')}
          href={createHrefToPath(datacenterListFullyQualified)}
          isActive={matchLocation(vsphere)}
        />
      )}
      {shouldRenderXenServer && (
        <MenuItem
          {...props}
          id="main-nav-xenserver"
          key="main-nav-xenserver"
          label={t('in-components:mainNavigation.viewSwitcherLabelXenServer')}
          href={createHrefToPath(xenserverHostListFullyQualified)}
          isActive={matchLocation(xenserver)}
        />
      )}
      {shouldRenderWindowsHypervisor && (
        <MenuItem
          {...props}
          id="main-nav-windowshypervisor"
          key="main-nav-windowshypervisor"
          label={t('in-components:mainNavigation.viewSwitcherLabelWindowsHypervisor')}
          href={createHrefToPath(windowsHypervisorHostListFullyQualified)}
          isActive={matchLocation(windowsHypervisor)}
        />
      )}
    </>
  );
}
