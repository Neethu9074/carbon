/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem, SideNavMenu, SvgIcon, useUIShellContext } from '@instana/components';

import {
  kubernetesAccessPermissions,
  linuxKVMHypervisorAccessPermissions,
  nutanixAccessPermissions,
  openStackAccessPermissions,
  pcfAccessPermissions,
  phmcAccessPermissions,
  powerVcAccessPermissions,
  sapAccessPermissions,
  vSphereAccessPermissions,
  windowsHypervisorAccessPermissions,
  xenServerAccessPermissions,
  zhmcAccessPermissions
} from 'in-stores/permission';
import {
  linuxKVMHypervisorEnabled,
  nutanixEnabled,
  openstackEnabled,
  pcfEnabled,
  phmcEnabled,
  playwithEnabled,
  powervcEnabled,
  sapEnabled,
  vsphereEnabled,
  windowsHypervisorEnabled,
  xenserverEnabled,
  zhmcEnabled
} from 'in-services/featureFlags';
// @ts-expect-error no declaration file
import { sap, sapSystemListFullyQualified as sapSystemList } from 'in-sap/navigation/paths';
import {
  cloudfoundry,
  applicationListFullyQualified as cloudfoundryApplicationList
} from 'in-cloudfoundry/navigation/paths';
// @ts-expect-error needs ts migration
import { openstack, regionListFullyQualified } from 'in-openstack/navigation/paths';
import { linuxkvmhypervisor, linuxkvmhypervisorHostListFullyQualified } from 'in-linux-kvm-hypervisor/navigation/paths';
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
import useHasAccess from 'in-stores/useHasAccess';
import { t } from 'in-i18n';

interface RenderOptionsPermissions {
  hasKubernetesAccess: boolean;
  hasLinuxKVMHypervisorAccess: boolean;
  hasNutanixAccess: boolean;
  hasOpenStackAccess: boolean;
  hasPCFAccess: boolean;
  hasPHMCAccess: boolean;
  hasPowerVcAccess: boolean;
  hasSAPAccess: boolean;
  hasVSphereAccess: boolean;
  hasZHMCAccess: boolean;
  hasXenServerAccess: boolean;
  hasWindowsHypervisorAccess: boolean;
}

interface RenderOptions {
  shouldRenderPCFA: boolean;
  shouldRenderPHMCA: boolean;
  shouldRenderPowerVc: boolean;
  shouldRenderZHMCA: boolean;
  shouldRenderOpenStack: boolean;
  shouldRenderKubernetes: boolean;
  shouldRenderNutanix: boolean;
  shouldRenderSap: boolean;
  shouldRenderVSphere: boolean;
  shouldRenderXenServer: boolean;
  shouldRenderWindowsHypervisor: boolean;
  shouldRenderLinuxKVMHypervisor: boolean;
}

function getRenderOptions({
  hasKubernetesAccess,
  hasLinuxKVMHypervisorAccess,
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
}: RenderOptionsPermissions): RenderOptions {
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
  const shouldRenderLinuxKVMHypervisor = hasLinuxKVMHypervisorAccess && !playwithEnabled;

  return {
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
    shouldRenderWindowsHypervisor,
    shouldRenderLinuxKVMHypervisor
  };
}

function getNumberOfAllowedPlatforms(permissions: RenderOptionsPermissions): number {
  const {
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
    shouldRenderWindowsHypervisor,
    shouldRenderLinuxKVMHypervisor
  } = getRenderOptions(permissions);

  return [
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
    shouldRenderWindowsHypervisor,
    shouldRenderLinuxKVMHypervisor
  ].filter(Boolean).length;
}

export default function PlatformsMenuItem() {
  const hasKubernetesAccess = useHasAccess({ requiredPermissions: kubernetesAccessPermissions });
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
  const hasSAPAccess = useHasAccess({
    optionalPrecondition: sapEnabled,
    requiredPermissions: sapAccessPermissions
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
  const permissions: RenderOptionsPermissions = {
    hasKubernetesAccess,
    hasLinuxKVMHypervisorAccess,
    hasNutanixAccess,
    hasOpenStackAccess,
    hasPCFAccess,
    hasPHMCAccess,
    hasPowerVcAccess,
    hasSAPAccess,
    hasVSphereAccess,
    hasWindowsHypervisorAccess,
    hasXenServerAccess,
    hasZHMCAccess
  };
  const numberOfAllowedPlatforms = getNumberOfAllowedPlatforms(permissions);
  const renderOptions = getRenderOptions(permissions);

  if (numberOfAllowedPlatforms === 0) return null;

  if (numberOfAllowedPlatforms === 1)
    return <PlatformsMenuItemContent icon="lib_platforms_inverted" {...renderOptions} />;

  return <PlatformsSideNavMenuItem {...renderOptions} />;
}

function PlatformsSideNavMenuItem(renderOptions: RenderOptions) {
  const { matchLocation } = useNavigation();
  const { isSideNavExpanded } = useUIShellContext();

  const isActive = matchLocation(
    cloudfoundry,
    ibmp,
    powervc,
    ibmz,
    linuxkvmhypervisor,
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
      <PlatformsMenuItemContent {...renderOptions} />
    </SideNavMenu>
  );
}

interface PlatformsMenuItemContentProps extends RenderOptions {
  icon?: string;
}

function PlatformsMenuItemContent(props: PlatformsMenuItemContentProps) {
  const { matchLocation, createHrefToPath } = useNavigation();
  const {
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
    shouldRenderWindowsHypervisor,
    shouldRenderLinuxKVMHypervisor
  } = props;

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
      {shouldRenderLinuxKVMHypervisor && (
        <MenuItem
          {...props}
          id="main-nav-linuxkvmhypervisor"
          key="main-nav-linuxkvmhypervisor"
          label={t('in-components:mainNavigation.viewSwitcherLabelLinuxKVMHypervisor')}
          href={createHrefToPath(linuxkvmhypervisorHostListFullyQualified)}
          isActive={matchLocation(linuxkvmhypervisor)}
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
