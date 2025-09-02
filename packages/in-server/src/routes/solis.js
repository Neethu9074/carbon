/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const i18next = require('i18next');
const middleware = require('i18next-http-middleware');

const relevantDocs = require('../solis/helpPanelArticles');
const relevantTours = require('../solis/helpPanelTours');

const { getCurrentUser } = require('../auth');
const { activeResolver } = require('../services/resolvers');
const { solisHubRoute, createRequest } = require('./solis-hub');

const i18nPath = path.join(__dirname, '..', '..', 'i18n');
const namespace = 'in-server';
const translations = {};

fs.readdirSync(i18nPath).forEach(file => {
  if (file.endsWith('.json')) {
    const langCode = path.basename(file, '.json');
    const content = require(path.join(i18nPath, file));

    translations[langCode] = {
      [namespace]: content
    };
  }
});

i18next.use(middleware.LanguageDetector).init({
  fallbackLng: {
    en: ['en-US'],
    de: ['de-DE'],
    es: ['es-ES'],
    fr: ['fr-FR'],
    it: ['it-IT'],
    ja: ['ja-JA'],
    ko: ['ko-KO'],
    pt: ['pt-BR'],
    zh: ['zh-CN'],
    'zh-Hant': ['zh-TW'],
    default: ['en-US']
  },
  preload: Object.keys(translations),
  resources: translations,
  load: 'languageOnly',
  returnNull: false,
  defaultNS: namespace,
  ns: [namespace]
});

const router = (module.exports = express.Router());

router.get('/solis/hub_content', middleware.handle(i18next), solisHubRoute);

router.get('/solis/nav', middleware.handle(i18next), async (req, res) => {
  try {
    const t = req.t;
    // Get feature flags
    const featureFlags = await activeResolver.getFeatureFlags(req.tenant, req.unit);

    // Get user permission
    const [userStatusCode, userStr] = await getCurrentUser(req);
    if (userStatusCode !== 200) {
      return res.sendStatus(userStatusCode);
    }
    const user = getParsedUser(userStr);
    const role = user?.role ?? {};

    // Get infra resource: host count
    const infraResource = {
      hasEntities: false,
      hostCount: 0,
      incidentCount: 0
    };
    const [statusCodeHost, hostData] = await getHostCount(req);
    if (statusCodeHost === 200 && hostData && typeof hostData.hostCount === 'number') {
      infraResource.hasEntities = !!hostData.hasEntities;
      infraResource.hostCount = hostData.hostCount;
    }

    // Get infra resource: incidents count
    const [incidentStatusCode, openIncidentCount] = await getIncidentCount(req);
    if (incidentStatusCode === 200 && typeof openIncidentCount === 'number') {
      infraResource.incidentCount = openIncidentCount;
    }

    const navItems = {
      top: generateTopNavItems(t, req.tenant, req.unit),
      side: generateSideNavItems(t, role, featureFlags, infraResource)
    };

    res.status(200).json(navItems);
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Error getting navigation:', error);
    res.sendStatus(500);
  }
});

async function getHostCount(req) {
  try {
    const hostCountRequest = createRequest(req, '/api/infrastructure-monitoring/monitoring-state');

    const response = await fetch(hostCountRequest);
    const status = response.status;
    let hostCount = null;

    if (response.ok) {
      hostCount = await response.json();
    }

    return [status, hostCount];
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Error fetching host data:', error);
    return [500, null];
  }
}

async function getIncidentCount(req) {
  try {
    const incidentRequest = createRequest(req, '/api/events?eventTypeFilters=INCIDENT');

    const response = await fetch(incidentRequest);
    const status = response.status;
    let count = 0;
    if (response.ok) {
      const events = await response.json();
      for (const event of events) {
        if (event.state === 'open') {
          count++;
        }
      }
    }
    return [status, count];
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Error fetching incident data:', error);
    return [500, null];
  }
}

function getUserPermissions(role, features) {
  const getAccess = (canField, limitedField = null) => {
    if (limitedField && role[limitedField] === false) return true;
    return role.permissions.includes(canField);
  };

  const hasWebsitesAccess = getAccess('ACCESS_WEBSITES', 'limitedWebsitesScope');
  const hasMobileAppsAccess = getAccess('ACCESS_MOBILE_APPS', 'limitedMobileAppsScope');
  const hasBizOpsAccess = getAccess('ACCESS_BIZOPS', 'limitedBizOpsScope');
  const hasApplicationsAccess = getAccess('ACCESS_APPLICATIONS', 'limitedApplicationsScope');
  const hasInfrastructureAccess = getAccess('ACCESS_INFRASTRUCTURE', 'limitedInfrastructureScope');
  const hasInfrastructureAnalyzeAccess = getAccess('ACCESS_INFRASTRUCTURE_ANALYZE', 'limitedInfrastructureScope');
  const hasAutomationAccess =
    getAccess('ACCESS_AUTOMATION', 'limitedAutomationScope') && features.actionAutomationEnabled;
  const hasSyntheticsAccess = getAccess('ACCESS_SYNTHETICS', 'limitedSyntheticsScope') && features.syntheticsEnabled;

  const hasPCFAccess = getAccess('ACCESS_PCF', 'limitedPcfScope') && features.pcfEnabled;
  const hasPHMCAccess = getAccess('ACCESS_PHMC', 'limitedPhmcScope') && features.phmcEnabled;
  const hasPowerVcAccess = getAccess('ACCESS_POWERVC', 'limitedPvcScope') && features.powervcEnabled;
  const hasZHMCAccess = getAccess('ACCESS_ZHMC', 'limitedZhmcScope') && features.zhmcEnabled;
  const hasOpenStackAccess = getAccess('ACCESS_OPENSTACK', 'limitedOpenstackScope') && features.openstackEnabled;
  const hasKubernetesAccess = getAccess('ACCESS_KUBERNETES', 'limitedKubernetesScope');
  const hasNutanixAccess = getAccess('ACCESS_NUTANIX', 'limitedNutanixScope') && features.nutanixEnabled;
  const hasSAPAccess = getAccess('ACCESS_SAP', 'limitedSapScope') && features.sapEnabled;
  const hasVSphereAccess = getAccess('ACCESS_VSPHERE', 'limitedVsphereScope') && features.vsphereEnabled;
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
  const hasSloAccess = hasApplicationsAccess || hasSyntheticsAccess || hasWebsitesAccess;

  return {
    hasWebsitesAccess,
    hasMobileAppsAccess,
    hasBizOpsAccess,
    hasApplicationsAccess,
    hasInfrastructureAccess,
    hasInfrastructureAnalyzeAccess,
    hasAutomationAccess,
    hasSyntheticsAccess,
    hasSloAccess,
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

function generateTopNavItems(t, tenantName, unitName) {
  const topNavItems = [];

  const tenantAndUnit = tenantName + ' | ' + unitName;

  topNavItems.push({
    id: 'switch_tenant',
    type: 'icon_button',
    mode: 'custom', // enables sending a custom event
    properties: {
      label: tenantAndUnit,
      children: tenantAndUnit,
      style: {
        // uses solis-nav internal variable
        color: 'var(--text-secondary, #C6C6C6)',
        padding: '8px',

        // from Figma design: Utility styles/label-01, Text/text-secondary
        // only have to override this size according to design:
        fontSize: '12px',

        width: 'auto', // overriding width or the icon button
        maxWidth: '150px',

        // to enable the ellipsis:
        display: 'inline-block',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }
    }
  });
  topNavItems.push({
    id: 'share',
    type: 'icon_button',
    mode: 'custom',
    icon_name: 'share',
    properties: {
      label: t('in-server:solis.share')
    }
  });
  topNavItems.push({
    id: 'help',
    type: 'icon_button',
    mode: 'native',
    icon_name: 'help',
    properties: {
      label: t('in-server:solis.helpPanel.panelTitle')
    }
  });

  return topNavItems;
}

function generateSideNavItems(t, role, features, infraResource) {
  const permissions = getUserPermissions(role, features);

  let navItems = [];

  // HomeLink
  navItems.push({
    type: 'link',
    properties: {
      icon_name: 'home',
      label: t('in-server:mainNavigation.home'),
      path: '#/home',
      is_root: true
    }
  });

  // WebsiteMobileAppView
  if (permissions.hasWebsitesAccess && permissions.hasMobileAppsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'devices--apps',
        label: t('in-server:mainNavigation.viewSwitcherLabelWebsitesAndMobileApps'),
        path: '#/websiteMonitoring'
      }
    });
  } else if (permissions.hasWebsitesAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'application--web',
        label: t('in-server:mainNavigation.viewSwitcherLabelWebsites'),
        path: '#/websiteMonitoring'
      }
    });
  } else if (permissions.hasMobileAppsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'application--mobile',
        label: t('in-server:mainNavigation.viewSwitcherLabelMobileApps'),
        path: '#/mobileAppMonitoring'
      }
    });
  }

  // BizOps
  if (permissions.hasBizOpsAccess) {
    const bizOpsPath = infraResource.hostCount === 0 ? '#/businessProcesses' : '#/businessPerspectives';

    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'business-processes',
        label: t('in-server:mainNavigation.businessMonitoring'),
        path: bizOpsPath
      }
    });
  }

  // Applications
  if (permissions.hasApplicationsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'application',
        label: t('in-server:mainNavigation.viewSwitcherLabelApplications'),
        path: '#/applications'
      }
    });
  }

  // Platforms
  if (permissions.hasAPlatformAccess) {
    navItems.push({
      type: 'menu',
      properties: {
        icon_name: 'platforms',
        label: t('in-server:mainNavigation.viewSwitcherLabelPlatforms'),
        links: generatePlatformItems(t, permissions, features)
      }
    });
  }

  // Infrastructure
  if (permissions.hasInfrastructureAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'layers',
        label: t('in-server:mainNavigation.viewSwitcherlabelInfrastructure'),
        path: '#/physical'
      }
    });
  }

  navItems.push(...generateToolItems(t, role, permissions, features, infraResource));

  navItems.push(...generateAdministrationItems(t, role, features));

  return navItems;
}

function generatePlatformItems(t, permissions, features) {
  let platformItems = [];

  if (permissions.hasPCFAccess) {
    platformItems.push({
      icon_name: 'cloud-foundry--1',
      label: t('in-server:mainNavigation.viewSwitcherLabelCloudFoundry'),
      path: '#/cloudfoundry/applications'
    });
  }

  if (permissions.hasPHMCAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'ibm--power-with-vpc',
      label: t('in-server:mainNavigation.viewSwitcherLabelphmc'),
      path: '#/ibmp/phmcs'
    });
  }

  if (permissions.hasPowerVcAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'ibm--power-vs',
      label: t('in-server:mainNavigation.viewSwitcherLabelPowervc'),
      path: '#/powervc/regions'
    });
  }

  if (permissions.hasZHMCAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'z--systems',
      label: t('in-server:mainNavigation.viewSwitcherLabelzhmc'),
      path: '#/ibmz/zhmcs'
    });
  }

  if (permissions.hasOpenStackAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'unknown',
      label: t('in-server:mainNavigation.viewSwitcherLabelOpenstack'),
      path: '#/openstack/regions'
    });
  }

  if (permissions.hasKubernetesAccess) {
    platformItems.push({
      icon_name: 'kubernetes',
      label: t('in-server:mainNavigation.viewSwitcherLabelKubernetes'),
      path: '#/kubernetes/clusters'
    });
  }

  if (permissions.hasNutanixAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'unknown',
      label: t('in-server:mainNavigation.viewSwitcherLabelNutanix'),
      path: '#/nutanix/datacenters'
    });
  }

  if (permissions.hasSAPAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'unknown',
      label: t('in-server:mainNavigation.viewSwitcherLabelSap'),
      path: '#/sap/sapsystemslist'
    });
  }

  if (permissions.hasVSphereAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'unknown',
      label: t('in-server:mainNavigation.viewSwitcherLabelvSphere'),
      path: '#/vsphere/datacenters'
    });
  }

  return platformItems;
}

function generateToolItems(t, role, permissions, features, infraResource) {
  let toolItems = [];

  // CustomDashboards
  toolItems.push({
    type: 'link',
    properties: {
      hasDivider: true,
      icon_name: 'dashboard',
      label: t('in-server:mainNavigation.viewSwitcherCustomDashboards'),
      path: '#/customDashboards'
    }
  });

  // Logging
  if (features.loggingEnabled) {
    toolItems.push({
      type: 'link',
      properties: {
        icon_name: 'cloud--logging',
        label: t('in-server:mainNavigation.viewSwitcherLabelLogs'),
        path: '#/logging'
      }
    });
  }

  // Synthetics
  if (permissions.hasSyntheticsAccess) {
    toolItems.push({
      type: 'link',
      properties: {
        icon_name: 'cloud--monitoring',
        label: t('in-server:mainNavigation.labelSyntheticMonitoring'),
        path: '#/syntheticTests'
      }
    });
  }

  // Analyze
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

    toolItems.push({
      type: 'link',
      properties: {
        icon_name: 'data-analytics',
        label: t('in-server:mainNavigation.viewSwitcherLabelAnalytics'),
        path: analyzePath
      }
    });
  }
  // VulnerabilityCenter
  if (features.vulnerabilityCenterEnabled) {
    toolItems.push({
      type: 'link',
      properties: {
        icon_name: 'security',
        label: t('in-server:mainNavigation.viewVulnerabilityCenter'),
        path: '#/vulnerability-center'
      }
    });
  }

  // Incidents
  if (permissions.hasEventsAccess) {
    toolItems.push({
      type: 'link',
      properties: {
        icon_name: 'warning--alt',
        label: t('in-server:mainNavigation.viewSwitcherLabelEvents'),
        path: '#/events;view=incident',
        ...(infraResource.incidentCount > 0 && { badge: infraResource.incidentCount })
      }
    });
  }

  // AutomationMenu
  if (permissions.hasAutomationAccess) {
    toolItems.push({
      type: 'link',
      properties: {
        icon_name: 'workflow-automation',
        label: t('in-server:mainNavigation.automation'),
        path: '#/automation/actionCatalog'
      }
    });
  }

  // SloDashboard
  if (permissions.hasSloAccess && !features.playwithEnabled) {
    toolItems.push({
      type: 'link',
      properties: {
        icon_name: 'service-levels',
        label: t('in-server:mainNavigation.viewSwitcherLabelSlo'),
        path: '#/slo'
      }
    });
  }

  return toolItems;
}

function generateAdministrationItems(t, role, features) {
  let adminItems = [];

  // Settings
  if (!features.playwithEnabled) {
    adminItems.push({
      type: 'link',
      properties: {
        hasDivider: true,
        icon_name: 'settings',
        label: t('in-server:mainNavigation.viewSwitcherLabelSettings'),
        path: '#/config'
      }
    });
  }

  // Datasources
  // Only show the Datasources menu item if the new OpenTelemetry page is enabled
  if (role?.canConfigureAgents && features.newOTelPageEnabled) {
    adminItems.push({
      type: 'link',
      properties: {
        icon_name: 'data--reference', // TODO: there is no appropriate carbon icon available
        label: t('in-server:mainNavigation.viewSwitcherLabelDataSources'),
        path: '#/datasources/instanaagent' // this is currently under discussion by PLG team
      }
    });
  }

  // account & billing
  if (features.newAccountAndBillingPageEnabled && features.ampEnabled && role.canViewAccountAndBillingInformation) {
    adminItems.push({
      type: 'link',
      properties: {
        icon_name: 'account',
        label: t('in-server:mainNavigation.viewSwitcherLabelAccountAndBilling'),
        path: '#/accountAndBilling'
      }
    });
  }

  // Internal
  // Remark: The old comparision of the current url is not longer possible,
  // and no checking if user already had clicked 10 times and activated it.
  // This is what we have in the client:
  //  window.location.href.indexOf('/#/internal') != -1 || hasInternalFeatureEnabledPerLocalStorage()
  if (features.internalMonitoringUnit || role?.canSeeExtendedInternalMonitoring) {
    adminItems.push({
      type: 'link',
      properties: {
        icon_name: 'locked',
        label: t('in-server:mainNavigation.viewSwitcherLabelInternal'),
        path: '#/internal'
      }
    });
  }

  // see "moreItems" below

  // The following menu items should be top nav
  // // release note

  // // doc
  // moreItems.push({
  //   type: 'link',
  //   properties: {
  // label: t('in-server:mainNavigation.viewSwitcherLabelDocumentation'),
  //     path: 'https://www.ibm.com/docs/en/obi/current'
  //   }
  // });

  // // Support
  // moreItems.push({
  //   type: 'link',
  //   properties: {
  //     label: t('in-server:mainNavigation.viewSwitcherLabelSupport'),
  //     path: 'https://www.ibm.com/mysupport/s/?language=en_US'
  //   }
  // });

  // More
  /* TODO Activate only, when the supported way of having buttons/links in in
  solis shell.
  Atm. it only can contain relative paths - so the instana native features won't be available.

  Comment out for that reason.
   */

  /*
  adminItems.push({
    type: 'menu',
    icon_name: 'overflow-menu--vertical',
    properties: {
      hasDivider: true,
      isEventDriven: true,
      isRoot: true,
      icon_name: 'overflow-menu--vertical',
      label: t('in-server:mainNavigation.viewSwitcherLabelMore'),
      links: generateMoreItems(t, role)
    }
  });
  */
  return adminItems;
}

/* see above: functionality is currently not supported by solis-nav:
function generateMoreItems(t, role) {
  let moreItems = [];

  // release note
  moreItems.push({
    id: "release",
    isEventDriven: true, // <- maybe a possible approach, not available yet.
    label: t('in-server:mainNavigation.viewSwitcherLabelSupport'),
    path: 'https://www.ibm.com/mysupport/s/?language=en_US',
    //TODO: define as an externa link
  });

  // doc
  moreItems.push({
    id: "docs",
    isEventDriven: true,
    label: t('in-server:mainNavigation.viewSwitcherLabelDocumentation'),
    path: 'https://www.ibm.com/docs/en/obi/current'
    //TODO: define as an externa link
  });

  // Support
  moreItems.push({
    id: "support",
    isEventDriven: true,
    label: t('in-server:mainNavigation.viewSwitcherLabelSupport'),
    path: 'https://www.ibm.com/mysupport/s/?language=en_US',
    //TODO: define as an externa link
  });


  // Only show the Agents menu item if the new OpenTelemetry page is NOT enabled
  // agents
  if (role?.canConfigureAgents && !features.newOTelPageEnabled) {
    moreItems.push({
      icon_name: 'data--reference', // TODO: there is no appropriate carbon icon available
      label: t('in-server:mainNavigation.viewSwitcherLabelAgents'),
      path: '#/datasources/instanaagent'
    });
  }

  // TODO: needs still About here?
  moreItems.push({
    id: "about",
    isEventDriven: true, // or something similar like th top-nav works, to trigger an action
    label: t('in-server:mainNavigation.viewSwitcherLabelAboutInstana'),
  });

  return moreItems;
}
*/

router.get('/solis/about', middleware.handle(i18next), async (req, res) => {
  try {
    const instanaVersion = await getInstanaVersion(req);

    const aboutInfo = getAbout(instanaVersion);
    res.json(aboutInfo);
  } catch (err) {
    /* eslint-disable no-console */
    console.error('Unexpected error in /solis/about:', err);
    res.status(500).json({ error: 'Failed to fetch about information' });
  }
});

function getAbout({ version, build_number }) {
  return {
    description: 'Instana Observability',
    version,
    build_number,
    docs_link: 'https://www.ibm.com/docs/en/instana-observability',
    copyright_years: '2021 - 2025'
  };
}

async function getInstanaVersion(req) {
  const instanaVersion = {
    version: '',
    build_number: ''
  };

  try {
    const versionRequest = createRequest(req, '/api/instana/version');
    const response = await fetch(versionRequest);

    if (!response.ok) {
      console.warn(`Instana version fetch failed with status ${response.status}`);
      return instanaVersion;
    }

    const versionData = await response.json();
    instanaVersion.version = versionData.branch || '';
    instanaVersion.build_number = versionData.imageTag || '';
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Error fetching Instana version:', error);
  }

  return instanaVersion;
}

router.get('/solis/help', middleware.handle(i18next), (req, res) => {
  const t = req.t;

  res.setHeader('Content-Type', 'application/json');
  res.end(getHelp(t));
});

function getHelp(t) {
  let content = {
    sections: [
      {
        id: 'relevant_tours',
        title: t('in-server:solis.helpPanel.tourSectionTitle'),
        tiles: relevantTours(t)
      },
      {
        id: 'relevant_articles',
        title: t('in-server:solis.helpPanel.articleSectionTitle'),
        tiles: relevantDocs(t)
      }
    ]
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
