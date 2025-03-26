/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const express = require('express');
const i18next = require('i18next');
const middleware = require('i18next-http-middleware');

const { getCurrentUser } = require('../auth');
const { activeResolver } = require('../services/resolvers/index');

const translations = require('./translation.json');

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
  defaultNS: 'mainNavigation',
  ns: ['mainNavigation']
});

const router = (module.exports = express.Router());

router.use(middleware.handle(i18next));

router.get('/solis/hub_content', async (req, res) => {
  const t = req.t;

  const finalResponseBody = { title: t('Monitoring and Observability'), widgets: [] };

  try {
    const dashboardRequest = new Request(req.uiBackendBaseUrl + '/api/custom-dashboard');
    dashboardRequest.headers.set('Authorization', req.headers.authorization);

    let response = await fetch(dashboardRequest);
    if (!response.ok) {
      throw new Error('error calling /custom-dashboard: ' + JSON.stringify(response.body));
    }

    const responseObject = await response.json();
    const customDashboards = responseObject.slice(0, 10);

    // eslint-disable-next-line no-useless-escape
    const eventRequest = new Request(req.uiBackendBaseUrl + '/api/events?eventTypeFilters=INCIDENT');
    eventRequest.headers.set('Authorization', req.headers.authorization);
    response = await fetch(eventRequest);
    if (!response.ok) {
      throw new Error('error calling /events: ' + JSON.stringify(response.body));
    }

    const events = await response.json();

    let warningEvents = 0,
      criticalEvents = 0,
      totalEvents = 0;

    for (const event of events) {
      if (event.state === 'open') {
        totalEvents++;
        if (event.severity === 8) {
          warningEvents++;
        } else if (event.severity === 10) {
          criticalEvents++;
        }
      }
    }

    finalResponseBody.widgets.push({
      type: 'kpi_tile',
      properties: {
        title: t('Critical Events'),
        tag: { type: 'high-contrast', children: t('Event') },
        kpi: { label: t('Active/Total'), primary_value: `${criticalEvents}/${totalEvents}` }
      },
      href: '#/events;orderDirection=DESC;orderBy=start;filter;view=incident?q=event.severity%3Acritical%20and%20event.state%3AOPEN'
    });

    finalResponseBody.widgets.push({
      type: 'kpi_tile',
      properties: {
        title: t('Warning Events'),
        tag: { type: 'high-contrast', children: t('Event') },
        kpi: { label: t('Active/Total'), primary_value: `${warningEvents}/${totalEvents}` }
      },
      href: '#/events;orderDirection=DESC;orderBy=start;filter;view=incident?q=event.severity%3Awarning%20and%20event.state%3AOPEN'
    });

    for (const dashboard of customDashboards) {
      const ownerRequest = new Request(req.uiBackendBaseUrl + '/api/settings/users/' + dashboard.ownerId);
      ownerRequest.headers.set('Authorization', req.headers.authorization);

      await fetch(ownerRequest)
        .then(response => response.json())
        .then(data => {
          const tagText = dashboard.annotations.includes('SHARED')
            ? t('Custom Dashboard - Shared')
            : t('Custom Dashboard');

          finalResponseBody.widgets.push({
            type: 'kpi_tile',
            properties: {
              title: dashboard.title,
              tag: { type: 'cyan', children: tagText },
              kpi: { label: t('Owner'), primary_value: data.fullName }
            },
            href: `#/customDashboards/view;dashboardId=${dashboard.id}`
          });
        })
        .catch(error => {
          throw new Error('error calling /settings/users: ' + error.message);
        });
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(finalResponseBody));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify(error.message));
  }
});

router.get('/solis/nav', async (req, res) => {
  const t = req.t;

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
      side: generateSideNavItems(t, role, featureFlags)
    })
  );
});

function getUserPermissions(role, features) {
  const getAccess = (canField, limitedField = null) => {
    // if (!role) return false;
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

function generateSideNavItems(t, role, features) {
  const permissions = getUserPermissions(role, features);

  let navItems = [];

  // HomeLink
  navItems.push({
    type: 'link',
    properties: {
      icon_name: 'home',
      label: t('home'),
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
        label: t('viewSwitcherLabelWebsitesAndMobileApps'),
        path: '#/websiteMonitoring'
      }
    });
  } else if (permissions.hasWebsitesAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'application--web',
        label: t('viewSwitcherLabelWebsites'),
        path: '#/websiteMonitoring'
      }
    });
  } else if (permissions.hasMobileAppsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'application--mobile',
        label: t('viewSwitcherLabelMobileApps'),
        path: '#/mobileAppMonitoring'
      }
    });
  }

  // BizOps, having issue with hostCount
  // hostCount ==0, path is '/businessProcesses'
  if (permissions.hasBizOpsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'business-processes',
        label: t('businessMonitoring'),
        path: '#/businessPerspectives'
      }
    });
  }

  // Applications
  if (permissions.hasApplicationsAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'application',
        label: t('viewSwitcherLabelApplications'),
        path: '#/applications'
      }
    });
  }

  // Infrastructure
  if (permissions.hasInfrastructureAccess) {
    navItems.push({
      type: 'link',
      properties: {
        icon_name: 'layers',
        label: t('viewSwitcherlabelInfrastructure'),
        path: '#/physical'
      }
    });
  }

  // Platforms
  if (permissions.hasAPlatformAccess) {
    navItems.push({
      type: 'menu',
      properties: {
        label: t('viewSwitcherLabelPlatforms'),
        links: generatePlatformItems(t, permissions, features)
      }
    });
  }

  // Tools
  navItems.push({
    type: 'menu',
    properties: {
      label: t('viewSwitcherLabelTools'),
      links: generateToolItems(t, role, permissions, features)
    }
  });

  // Administration
  navItems.push({
    type: 'menu',
    properties: {
      label: t('viewSwitcherLabelAdministration'),
      links: generateAdministrationItems(t, role, features)
    }
  });

  return navItems;
}

function generatePlatformItems(t, permissions, features) {
  let platformItems = [];

  if (permissions.hasPCFAccess) {
    platformItems.push({
      icon_name: 'cloud-foundry--1',
      label: t('viewSwitcherLabelCloudFoundry'),
      path: '#/cloudfoundry/applications'
    });
  }

  if (permissions.hasPHMCAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'ibm--power-with-vpc',
      label: t('viewSwitcherLabelphmc'),
      path: '#/ibmp/phmcs'
    });
  }

  if (permissions.hasPowerVcAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'ibm--power-vs',
      label: t('viewSwitcherLabelPowervc'),
      path: '#/powervc/regions'
    });
  }

  if (permissions.hasZHMCAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'z--systems',
      label: t('viewSwitcherLabelzhmc'),
      path: '#/ibmz/zhmcs'
    });
  }

  if (permissions.hasOpenStackAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'unknown',
      label: t('viewSwitcherLabelOpenstack'),
      path: '#/openstack/regions'
    });
  }

  if (permissions.hasKubernetesAccess) {
    platformItems.push({
      icon_name: 'kubernetes',
      label: t('viewSwitcherLabelKubernetes'),
      path: '#/kubernetes/clusters'
    });
  }

  if (permissions.hasNutanixAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'unknown',
      label: t('viewSwitcherLabelNutanix'),
      path: '#/nutanix/datacenters'
    });
  }

  if (permissions.hasSAPAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'unknown',
      label: t('viewSwitcherLabelSap'),
      path: '#/sap/sapsystemslist'
    });
  }

  if (permissions.hasVSphereAccess && !features.playwithEnabled) {
    platformItems.push({
      icon_name: 'unknown',
      label: t('viewSwitcherLabelvSphere'),
      path: '#/vsphere/datacenters'
    });
  }

  return platformItems;
}

function generateToolItems(t, role, permissions, features) {
  let toolItems = [];

  // CustomDashboards
  toolItems.push({
    icon_name: 'dashboard',
    label: t('viewSwitcherCustomDashboards'),
    path: '#/customDashboards'
  });

  // Logging
  if (features.loggingEnabled) {
    toolItems.push({
      icon_name: 'cloud--logging',
      label: t('viewSwitcherLabelLogs'),
      path: '#/logging'
    });
  }

  // Synthetics
  if (permissions.hasSyntheticsAccess) {
    toolItems.push({
      icon_name: 'cloud--monitoring',
      label: t('labelSyntheticMonitoring'),
      path: '#/syntheticTests'
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
      icon_name: 'data-analytics',
      label: t('viewSwitcherLabelAnalytics'),
      path: analyzePath
    });
  }
  // VulnerabilityCenter
  if (features.vulnerabilityCenterEnabled) {
    toolItems.push({
      icon_name: 'security',
      label: t('viewVulnerabilityCenter'),
      path: '#/vulnerability-center'
    });
  }

  // Incidents
  if (permissions.hasEventsAccess) {
    toolItems.push({
      icon_name: 'warning--alt',
      label: t('viewSwitcherLabelEvents'),
      path: '#/events;view=incident',
      badge: 5 // todo fetch from API call
    });
  }

  // AutomationMenu
  if (permissions.hasAutomationAccess) {
    toolItems.push({
      icon_name: 'workflow-automation',
      label: t('automation'),
      path: '#/automation/actionCatalog'
    });
  }

  // SloDashboard
  if (permissions.hasApplicationsAccess && !features.playwithEnabled) {
    toolItems.push({
      icon_name: 'service-levels',
      label: t('viewSwitcherLabelSlo'),
      path: '#/slo'
    });
  }

  // agents
  if (role?.canConfigureAgents) {
    toolItems.push({
      icon_name: 'settings--services',
      label: t('viewSwitcherLabelAgents'),
      path: '#/agents'
    });
  }

  return toolItems;
}

function generateAdministrationItems(t, role, features) {
  let adminItems = [];

  // Settings
  if (!features.playwithEnabled) {
    adminItems.push({
      icon_name: 'settings',
      label: t('viewSwitcherLabelSettings'),
      path: '#/config'
    });
  }

  // Internal
  // todo: use the following logic:
  //     internalMonitoringUnit ||
  // (canSeeExtendedInternalMonitoring &&
  //   (window.location.href.indexOf('/#/internal') != -1 || hasInternalFeatureEnabledPerLocalStorage()))
  if (features.internalMonitoringUnit || role?.canSeeExtendedInternalMonitoring) {
    adminItems.push({
      icon_name: 'lib_actions_lock',
      label: t('viewSwitcherLabelInternal'),
      path: '#/internal'
    });
  }

  // // Tenant switch
  // if (!features.userProfileMenuEnabled && features.tenantSwitcherEnabled) {
  //   adminItems.push({
  //     type: 'link',
  //     properties: {
  //       label: t('viewSwitcherLabelTenants'),
  //       path: `https://${serverConfig.clientConfig.tenantUnitDomainSuffix}/tenantSwitcher`
  //     }
  //   });
  // }

  // The following menu items should be top nav
  // // release note

  // // doc
  // moreItems.push({
  //   type: 'link',
  //   properties: {
  //     label: t('viewSwitcherLabelDocumentation'),
  //     path: 'https://www.ibm.com/docs/en/obi/current'
  //   }
  // });

  // // Support
  // moreItems.push({
  //   type: 'link',
  //   properties: {
  //     label: t('viewSwitcherLabelSupport'),
  //     path: 'https://www.ibm.com/mysupport/s/?language=en_US'
  //   }
  // });

  return adminItems;
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
  const t = req.t;

  res.setHeader('Content-Type', 'application/json');
  res.end(getHelp(t));
});

function getHelp(t) {
  let content = {
    primary_content: {
      title: 'Opening a support case',
      description: 'To open a support case.',
      learn_more_href: 'https://www.ibm.com/docs/en/instana-observability/current?topic=support-opening-case'
    },
    addtl_docs_topics: [
      {
        label: t('viewSwitcherLabelDocumentation'),
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
