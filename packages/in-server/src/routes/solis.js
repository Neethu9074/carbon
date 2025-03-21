/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// import i18next from 'i18next';

const express = require('express');
// const { xXssProtection } = require('helmet');
const { t } = require('@instana/i18n-react');

const router = (module.exports = express.Router());

router.get('/solis/nav', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      top: [],
      side: generateSideNavItems()
    })
  );
});

const getUserPermissions = () => ({
  hasWebsitesAccess: true,
  hasMobileAppsAccess: true,
  hasBizOpsAccess: true,
  hasApplicationsAccess: true,
  hasInfrastructureAccess: true,
  hasAutomationAccess: true,
  hasAnalyzeAccess: true,
  hasLoggingAccess: true,
  hasSyntheticsAccess: false,
  hasEventsAccess: true
});

const getPlatformPermissions = () => ({
  hasPCFAccess: true,
  hasPHMCAccess: true,
  hasPowerVcAccess: true,
  hasZHMCAccess: true,
  hasOpenStackAccess: true,
  hasKubernetesAccess: true,
  hasNutanixAccess: true,
  hasSAPAccess: true,
  hasVSphereAccess: true
});

const getFeatureFlags = () => ({
  playwithEnabled: false,
  loggingEnabled: true,
  releaseNotesEnabled: true,
  vulnerabilityCenterEnabled: true
});

function generateSideNavItems() {
  const permissions = getUserPermissions();
  const platformPermissions = getPlatformPermissions();
  const features = getFeatureFlags();

  let navItems = [];

  // Home Link
  navItems.push({
    type: 'link',
    properties: {
      icon_name: 'lib_home',
      label: t('in-plg:home'),
      path: '#/home',
      is_root: true
    }
  });

  // WebsiteMobileAppView
  if (permissions.hasWebsitesAccess && permissions.hasMobileAppsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'main-lib_website_mobile_app_inverted-websites',
        label: t('Websites & mobile apps'),
        path: '#/websiteMonitoring',
        is_root: false
      }
    });
  } else if (permissions.hasWebsitesAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'lib_website_inverted',
        label: t('Websites'),
        path: '#/websiteMonitoring',
        is_root: false
      }
    });
  } else if (permissions.hasMobileAppsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'lib_mobile_app_inverted',
        label: t('Mobile apps'),
        path: '#/mobileAppMonitoring',
        is_root: false
      }
    });
  }

  // BizOps, having issue with hostCount
  // hostCount ==0, path is '/businessProcesses'
  if (permissions.hasBizOpsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'lib_bizops',
        label: t('Business Monitoring'),
        path: '#/businessPerspectives',
        is_root: false
      }
    });
  }

  // Applications
  if (permissions.hasApplicationsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'lib_application_invert',
        label: t('Applications'),
        path: '#/applications',
        is_root: false
      }
    });
  }

  const platformPermissionCount = Object.values(platformPermissions).filter(Boolean).length;
  // Platforms
  if (platformPermissionCount > 0) {
    navItems.push({
      type: 'menu',
      properties: {
        icon_name: 'lib_platforms_inverted',
        label: t('Platforms'),
        is_root: false,
        links: generatePlatformItems()
      }
    });
  }

  // Infrastructure
  if (permissions.hasInfrastructureAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'infrastructure',
        label: t('Infrastructure'),
        path: '#/physical',
        is_root: false
      }
    });
  }

  // TODO: add divider

  // CustomDashboards
  navItems.push({
    type: 'link',
    properties: {
      icon_name: 'lib_custom_dashboard',
      label: t('Custom dashboards'),
      path: '#/customDashboards',
      is_root: false
    }
  });

  // Logging
  if (features.loggingEnabled) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'lib_application_logging',
        label: t('Logs'),
        path: '#/logging',
        is_root: false,
        is_disabled: !permissions.hasLoggingAccess
      }
    });
  }

  // Synthetics
  if (permissions.hasSyntheticsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'lib_synthetic',
        label: t('Synthetic monitoring'),
        path: '#/syntheticTests',
        is_root: false,
        is_disabled: !permissions.hasLoggingAccess
      }
    });
  }

  // Analyze
  // TODO
  if (permissions.hasAnalyzeAccess) {
    //todo: (!hasAnalyzeAccess && !role?.canViewLogs)
    // let analyzePath = '';

    // if (hasApplicationsAccess) {
    // analyzePath = urlWithoutQueryParameter(getLinkToApplicationAnalyze({ dataSource: 'calls' }));
    // } else if (hasWebsitesAccess) {
    //   analyzePath = analyzeWebsiteHref!; // since we pass groupBy and beaconType this value is never null
    // } else if (role?.canViewLogs) {
    //   analyzePath = createHrefToPath(logsPathWithDataSource);
    // } else if (hasMobileAppsAccess) {
    //   analyzePath = getLinkToMobileAppAnalyze({ beaconType: 'sessionStart', groupBy: {} });
    // } else if (hasInfrastructureAnalyzeAccess) {
    //   analyzePath = getLinkToInfraEntityExplore(defaultInfraExploreViewParams);
    // }

    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'lib_analyze_inverted',
        label: t('Analytics'),
        path: '#/analyze',
        is_root: false
      }
    });
  }
  // VulnerabilityCenter
  if (features.vulnerabilityCenterEnabled) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'lib_events_cve',
        label: t('Vulnerabilities'),
        path: '#/vulnerability-center',
        is_root: false
        // on-click
      }
    });
  }

  // Incidents
  if (permissions.hasEventsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'lib_events_inverted',
        label: t('Events'),
        path: '#/events',
        is_root: false,
        badge: 5 // fetch from API call?
      }
    });
  }

  // AutomationMenu
  if (permissions.hasAutomationAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'lib_automation',
        label: t('Automation'),
        path: '#/automation/actionCatalog',
        is_root: false
      }
    });
  }

  // SloDashboard
  if (permissions.hasApplicationsAccess && !features.playwithEnabled) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'lib_service_level',
        label: t('Service levels'),
        path: '#/slo',
        is_root: false
      }
    });
  }

  // TODO: add divider

  // Settings
  // todo: if isInternalVisible, should be able to see "Internal"
  if (!features.playwithEnabled) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'lib_actions_settings_inverted',
        label: t('Settings'),
        path: '#/config',
        is_root: false
      }
    });
  }

  // More
  // TODO
  return navItems;
}

function generatePlatformItems() {
  const platformAccess = getPlatformPermissions();
  const features = getFeatureFlags();
  let platformItems = [];

  if (platformAccess.hasPCFAccess) {
    platformItems.push({
      type: 'link',
      properties: {
        label: t('Cloud Foundry'),
        path: '#/cloudfoundry/applications'
      }
    });
  }

  if (platformAccess.hasPHMCAccess && !features.playwithEnabled) {
    platformItems.push({
      type: 'link',
      properties: {
        label: t('IBM Power HMC'),
        path: '#/ibmp/phmcs'
      }
    });
  }

  if (platformAccess.hasPowerVcAccess && !features.playwithEnabled) {
    platformItems.push({
      type: 'link',
      properties: {
        label: t('IBM PowerVC'),
        path: '#/powervc//regions'
      }
    });
  }

  if (platformAccess.hasZHMCAccess && !features.playwithEnabled) {
    platformItems.push({
      type: 'link',
      properties: {
        label: t('IBM Z HMC'),
        path: '#/ibmz/zhmcs'
      }
    });
  }

  if (platformAccess.hasOpenStackAccess && !features.playwithEnabled) {
    platformItems.push({
      type: 'link',
      properties: {
        label: t('OpenStack'),
        path: '#/openstack/regions'
      }
    });
  }

  if (platformAccess.hasKubernetesAccess) {
    platformItems.push({
      type: 'link',
      properties: {
        label: t('Kubernetes'),
        path: '#/kubernetes/clusters'
      }
    });
  }

  if (platformAccess.hasNutanixAccess && !features.playwithEnabled) {
    platformItems.push({
      type: 'link',
      properties: {
        label: t('Nutanix'),
        path: '#/nutanix/datacenters'
      }
    });
  }

  if (platformAccess.hasSAPAccess && !features.playwithEnabled) {
    platformItems.push({
      type: 'link',
      properties: {
        label: t('SAP'),
        path: '#/sap/sapsystemslist'
      }
    });
  }

  if (platformAccess.hasVSphereAccess && !features.playwithEnabled) {
    platformItems.push({
      type: 'link',
      properties: {
        label: t('vSphere'),
        path: '#/vsphere/datacenters'
      }
    });
  }

  return platformItems;
}

router.get('/solis/about', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(getAbout());
});

function getAbout() {
  // hardcode version, and build number for mvp
  return JSON.stringify({
    description: 'Instana Observability',
    version: '1.0.1',
    build_number: '291',
    docs_link: 'https://www.ibm.com/products/instana',
    copyright_years: '2021 - 2025'
  });
}

router.get('/solis/help', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(getHelp());
});

function getHelp() {
  let content = {
    primary_content: {
      title: 'Opening a support case',
      description: 'To open a support case.',
      learn_more_href: 'https://www.ibm.com/docs/en/instana-observability/current?topic=support-opening-case'
    },
    addtl_docs_topics: [
      {
        label: 'Instana documentation',
        href: 'https://www.ibm.com/docs/en/instana-observability/current',
        description: 'Instana Official documentation'
      }
    ],
    feature_request_href: 'https://www.ibm.com/mysupport/s/?language=en_US',
    contact_support_href: 'https://ideas.ibm.com/products/6922406837448488098'
  };
  return JSON.stringify(content);
}
