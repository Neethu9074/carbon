/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// import i18next from 'i18next';

const express = require('express');
const { getCurrentUser } = require('../auth');
const { activeResolver } = require('../services/resolvers/index');

// const { xXssProtection } = require('helmet');
// const { t } = require('@instana/i18n-react');

const router = (module.exports = express.Router());

router.get('/solis/nav', async (req, res) => {
  const featureFlags = await activeResolver.getFeatureFlags(req.tenant, req.unit);

  const [statusCode, userStr] = await getCurrentUser(req);
  if (statusCode !== 200) {
    res.sendStatus(statusCode);
    return;
  }
  const user = getParsedUser(userStr);

  const role = user?.role ?? {};
  // const role = user.role;

  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      top: [],
      side: generateSideNavItems(role, featureFlags)
    })
  );
});

function getUserPermissions(role, features) {
  const getAccess = (canField, limitedField = null) => {
    // if (!role) return false;
    if (limitedField && role[limitedField] === false) return true;
    return role[canField] === true;
  };

  // const platformPermissions = getPlatformPermissions(role);
  // const hasAPlatformAccess = Object.values(platformPermissions).some(Boolean);
  const hasWebsitesAccess = getAccess(true, 'limitedWebsitesScope');
  const hasMobileAppsAccess = getAccess(true, 'limitedMobileAppsScope');
  const hasBizOpsAccess = getAccess(true, 'limitedBizOpsScope');
  const hasApplicationsAccess = getAccess(true, 'limitedApplicationsScope');
  const hasInfrastructureAccess = getAccess(true, 'limitedInfrastructureScope');
  const hasInfrastructureAnalyzeAccess = getAccess(role?.ACCESS_INFRASTRUCTURE_ANALYZE, 'limitedInfrastructureScope');
  const hasAutomationAccess = getAccess(true, 'limitedAutomationScope') && features.actionAutomationEnabled;
  const hasSyntheticsAccess = getAccess('canConfigureSyntheticTests', 'limitedSyntheticsScope');

  const hasPCFAccess = getAccess(true, 'limitedPcfScope') && features.pcfEnabled;
  const hasPHMCAccess = getAccess(true, 'limitedPhmcScope') && features.phmcEnabled;
  const hasPowerVcAccess = getAccess(true, 'limitedPvcScope') && features.powervcEnabled;
  const hasZHMCAccess = getAccess(true, 'limitedZhmcScope') && features.zhmcEnabled;
  const hasOpenStackAccess = getAccess(true, 'limitedOpenstackScope') && features.openstackEnabled;
  const hasKubernetesAccess = getAccess(true, 'limitedKubernetesScope');
  const hasNutanixAccess = getAccess(true, 'limitedNutanixScope') && features.nutanixEnabled;
  const hasSAPAccess = getAccess(true, 'limitedSapScope') && features.sapEnabled;
  const hasVSphereAccess = getAccess(true, 'limitedVsphereScope') && features.vsphereEnabled;
  const hasAPlatformAccess =
    hasVSphereAccess ||
    hasPHMCAccess ||
    hasZHMCAccess ||
    hasPCFAccess ||
    hasPowerVcAccess ||
    hasOpenStackAccess ||
    hasKubernetesAccess ||
    hasSAPAccess ||
    hasNutanixAccess;

  return {
    hasWebsitesAccess,
    hasMobileAppsAccess,
    hasBizOpsAccess,
    hasApplicationsAccess,
    hasInfrastructureAccess,
    hasInfrastructureAnalyzeAccess,
    hasAutomationAccess,
    hasSyntheticsAccess,
    hasAPlatformAccess,
    hasAnalyzeAccess:
      hasApplicationsAccess || hasWebsitesAccess || hasMobileAppsAccess || hasInfrastructureAnalyzeAccess,
    hasEventsAccess:
      hasWebsitesAccess ||
      hasMobileAppsAccess ||
      hasApplicationsAccess ||
      hasAPlatformAccess ||
      hasInfrastructureAccess ||
      hasSyntheticsAccess,
    hasPCFAccess,
    hasPHMCAccess,
    hasPowerVcAccess,
    hasZHMCAccess,
    hasOpenStackAccess,
    hasKubernetesAccess,
    hasNutanixAccess,
    hasSAPAccess,
    hasVSphereAccess
  };
}

function generateSideNavItems(role, features) {
  const permissions = getUserPermissions(role, features);

  let navItems = [];

  // HomeLink
  navItems.push({
    type: 'link',
    properties: {
      icon_name: 'home',
      label: 'Home',
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
        label: 'Websites & mobile apps',
        path: '#/websiteMonitoring',
        is_root: false
      }
    });
  } else if (permissions.hasWebsitesAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'application--web',
        label: 'Websites',
        path: '#/websiteMonitoring',
        is_root: false
      }
    });
  } else if (permissions.hasMobileAppsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'application--mobile',
        label: 'Mobile apps',
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
        label: 'Business Monitoring',
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
        icon_name: 'application',
        label: 'Applications',
        path: '#/applications',
        is_root: false
      }
    });
  }

  // Platforms
  if (permissions.hasAPlatformAccess) {
    navItems.push({
      type: 'menu',
      properties: {
        icon_name: 'lib_platforms_inverted',
        label: 'Platforms',
        is_root: false,
        links: generatePlatformItems(permissions, features)
      }
    });
  }

  // Infrastructure
  if (permissions.hasInfrastructureAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'layers',
        label: 'Infrastructure',
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
      icon_name: 'dashboard',
      label: 'Custom dashboards',
      path: '#/customDashboards',
      is_root: false
    }
  });

  // Logging
  if (features.loggingEnabled) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'cloud--logging',
        label: 'Logs',
        path: '#/logging',
        is_root: false
      }
    });
  }

  // Synthetics
  if (permissions.hasSyntheticsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'cloud--monitoring',
        label: 'Synthetic monitoring',
        path: '#/syntheticTests',
        is_root: false
      }
    });
  }

  // Analyze
  // TODO
  if (permissions.hasAnalyzeAccess || role?.canViewLogs) {
    let analyzePath = '';
    if (permissions.hasApplicationsAccess) {
      analyzePath = '#/analyze;dataSource=calls';
    } else if (permissions.hasWebsitesAccess) {
      analyzePath = '#/websiteMonitoring/analyzeBeacons;beaconType=pageLoad;';
    } else if (role?.canViewLogs) {
      analyzePath = '#/logs;dataSource=logs';
    } else if (permissions.hasMobileAppsAccess) {
      analyzePath = '#/mobileAppMonitoring/analyzeBeacons;beaconType=sessionStart';
    } else if (permissions.hasInfrastructureAnalyzeAccess) {
      analyzePath = '#/explore;tagFilterExpression=!~;group=(groupbyTag~type~ar)~;type=all;dataSource=infrastructure';
    }

    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'lib_analyze_inverted',
        label: 'Analytics',
        path: analyzePath,
        is_root: false
      }
    });
  }
  // VulnerabilityCenter
  if (features.vulnerabilityCenterEnabled) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'security',
        label: 'Vulnerabilities',
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
        label: 'Events',
        path: '#/events;view=incident',
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
        icon_name: 'workflow-automation',
        label: 'Automation',
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
        label: 'Service levels',
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
        icon_name: 'settings',
        label: 'Settings',
        path: '#/config',
        is_root: false
      }
    });
  }

  // More
  // TODO
  navItems.push({
    type: 'menu',
    properties: {
      label: 'More',
      is_root: false,
      links: generateMoreItems(role)
    }
  });

  return navItems;
}

function generatePlatformItems(permissions, features) {
  let platformItems = [];

  if (permissions.hasPCFAccess) {
    platformItems.push({
      icon_name: 'development',
      label: 'Cloud Foundry',
      path: '#/cloudfoundry/applications'
    });
  }

  if (permissions.hasPHMCAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'development',
      label: 'IBM Power HMC',
      path: '#/ibmp/phmcs'
    });
  }

  if (permissions.hasPowerVcAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'development',
      label: 'IBM PowerVC',
      path: '#/powervc/regions'
    });
  }

  if (permissions.hasZHMCAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'development',
      label: 'IBM Z HMC',
      path: '#/ibmz/zhmcs'
    });
  }

  if (permissions.hasOpenStackAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'development',
      label: 'OpenStack',
      path: '#/openstack/regions'
    });
  }

  if (permissions.hasKubernetesAccess) {
    platformItems.push({
      icon_name: 'development',
      label: 'Kubernetes',
      path: '#/kubernetes/clusters'
    });
  }

  if (permissions.hasNutanixAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'development',
      label: 'Nutanix',
      path: '#/nutanix/datacenters'
    });
  }

  if (permissions.hasSAPAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'development',
      label: 'SAP',
      path: '#/sap/sapsystemslist'
    });
  }

  if (permissions.hasVSphereAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'development',
      label: 'vSphere',
      path: '#/vsphere/datacenters'
    });
  }

  return platformItems;
}

function generateMoreItems(role) {
  let moreItems = [];

  // tenant switch
  // if (!features.userProfileMenuEnabled && features.tenantSwitcherEnabled) {
  //   moreItems.push({
  //     type: 'link',
  //     properties: {
  //       label: 'Tenants',
  //       path: '`https://${config.tenantUnitDomainSuffix}/tenantSwitcher`'
  //     }
  //   });
  // }

  // agents
  if (role?.canConfigureAgents) {
    moreItems.push({
      type: 'link',
      properties: {
        label: 'Agents',
        path: '#/agents'
      }
    });
  }

  // release note

  // doc
  moreItems.push({
    type: 'link',
    properties: {
      label: 'Documentation',
      path: 'https://www.ibm.com/docs/en/obi/current'
    }
  });

  // Support
  moreItems.push({
    type: 'link',
    properties: {
      label: 'Support',
      path: 'https://www.ibm.com/mysupport/s/?language=en_US'
    }
  });

  return moreItems;
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

function getParsedUser(userStr) {
  let user;
  try {
    user = JSON.parse(userStr);
  } catch (error) {
    user = null;
  }
  return user;
}
