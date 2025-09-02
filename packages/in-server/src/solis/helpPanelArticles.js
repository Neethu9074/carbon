/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const getDocConfigs = t => [
  {
    id: 'getting-started',
    title: t('in-server:solis.helpPanel.articles.home'),
    href: 'https://ibm.biz/insta-getstarted',
    route: '/home([?#].*)?$'
  },
  {
    id: 'websites',
    title: t('in-server:solis.helpPanel.articles.websites'),
    href: 'https://ibm.biz/monitoring-websites',
    route: '/#/websiteMonitoring/[^ ]*'
  },
  {
    id: 'mobile-apps',
    title: t('in-server:solis.helpPanel.articles.mobileApps'),
    href: 'https://ibm.biz/mob-app',
    route: '/#/mobileAppMonitoring/[^ ]*'
  },
  {
    id: 'bizops',
    title: t('in-server:solis.helpPanel.articles.businessProcesses'),
    href: 'https://ibm.biz/business-processes',
    route: '/#/businessProcesses[^ ]*|/#/businessPerspectives[^ ]*|/#/businessProcess[^ ]*'
  },
  {
    id: 'applications',
    title: t('in-server:solis.helpPanel.articles.applications'),
    href: 'https://ibm.biz/monitoring-applications',
    route: '/#/(applications|application)[^ ]*'
  },
  {
    id: 'services',
    title: t('in-server:solis.helpPanel.articles.services'),
    href: 'https://ibm.biz/app-services',
    route: '/#/(services|service)[^ ]*'
  },
  {
    id: 'smart-alerts',
    title: t('in-server:solis.helpPanel.articles.smartAlerts'),
    href: 'https://ibm.biz/app-perspectives-smart-alerts',
    route: '/#/alerts[^ ]*'
  },
  {
    id: 'cloud-foundry',
    title: t('in-server:solis.helpPanel.articles.cloudFoundry'),
    href: 'https://ibm.biz/monitoring-cloud-foundry-vmware-tanzu',
    route: '/#/cloudfoundry/application[^ ]*'
  },
  {
    id: 'powerHMC',
    title: t('in-server:solis.helpPanel.articles.powerHMC'),
    href: 'https://ibm.biz/monitoring-power-hmc',
    route: '/#/ibmp/(phmcs|systems)[^ ]*'
  },
  {
    id: 'powerVC-openstack',
    title: t('in-server:solis.helpPanel.articles.configureMicroService'),
    href: 'https://ibm.biz/insta-agent-vmtanzu-docs',
    route: '/#/(powervc|openstack)/regions[^ ]*'
  },
  {
    id: 'zHMC',
    title: t('in-server:solis.helpPanel.articles.zHMC'),
    href: 'https://ibm.biz/monitoring-z-hmc',
    route: '/#/ibmz/(zhmcs|systems)[^ ]*'
  },
  {
    id: 'kubernetes',
    title: t('in-server:solis.helpPanel.articles.kubernetes'),
    href: 'https://ibm.biz/monitoring-kubernetes',
    route: '/#/kubernetes/(clusters|cluster)[^ ]*'
  },
  {
    id: 'nutanix',
    title: t('in-server:solis.helpPanel.articles.nutanix'),
    href: 'https://ibm.biz/monitoring-nutanix',
    route: '/#/nutanix/datacenters[^ ]*'
  },
  {
    id: 'vSphere',
    title: t('in-server:solis.helpPanel.articles.vSphere'),
    href: 'https://ibm.biz/monitoring-vsphere',
    route: '/#/vsphere/datacenters[^ ]*'
  },
  {
    id: 'infrastructure',
    title: t('in-server:solis.helpPanel.articles.infrastructure'),
    href: 'https://ibm.biz/monitoring-infrastructure',
    route: '/#/(physical|container)(/dashboard)?[^ ]*'
  },
  {
    id: 'custom-dashboards',
    title: t('in-server:solis.helpPanel.articles.customDashboards'),
    href: 'https://ibm.biz/custom-dashboards',
    route: '/#/customDashboards(/view;dashboardId=[^/?]+)?[^ ]*'
  },
  {
    id: 'logging',
    title: t('in-server:solis.helpPanel.articles.logging'),
    href: 'https://ibm.biz/instana-logging',
    route: '/#/logging(/(alerts|delete|manage))?[^ ]*'
  },
  {
    id: 'synthetic-monitoring',
    title: t('in-server:solis.helpPanel.articles.syntheticMonitoring'),
    href: 'https://ibm.biz/synthetic-monitoring',
    route: '/#/(syntheticTests|syntheticLocations|syntheticCredentials|syntheticSmartAlerts|synthetic)[^ ]*'
  },
  {
    id: 'analyze-traces',
    title: t('in-server:solis.helpPanel.articles.analyzeTraces'),
    href: 'https://ibm.biz/analyzing-traces-calls',
    route: '/#/analyze[^ ]*'
  },
  {
    id: 'analyze-infrastructure',
    title: t('in-server:solis.helpPanel.articles.analyzeInfrastructure'),
    href: 'https://ibm.biz/analyze-infrastructure',
    route: '/#/(explore|profiles/analyzeProfiles)[^ ]*'
  },
  {
    id: 'concert',
    title: t('in-server:solis.helpPanel.articles.concert'),
    href: 'https://ibm.biz/viewing-data',
    route: '/#/vulnerability-center(/detection)?[^ ]*'
  },
  {
    id: 'automation',
    title: t('in-server:solis.helpPanel.articles.automation'),
    href: 'https://ibm.biz/managing-actions',
    route: '/#/automation/(actionCatalog(/actionDashboard)?|actionHistory|policies)[^ ]*'
  },
  {
    id: 'slo',
    title: t('in-server:solis.helpPanel.articles.slo'),
    href: 'https://ibm.biz/service-level-objectives-slos',
    route: '/#/slo(/(alerts|correctionWindows|objective))?[^ ]*'
  },
  {
    id: 'agents',
    title: t('in-server:solis.helpPanel.articles.agents'),
    href: 'https://ibm.biz/installing-agent',
    route: '/#/(agents|datasources/instanaagent/installation)[^ ]*'
  },
  {
    id: 'events-alerts',
    title: t('in-server:solis.helpPanel.articles.eventsAndAlerts'),
    href: 'https://ibm.biz/managing-events-alerts',
    route: '/#/config/global/alerting/(events|alerts|channels|maintenanceConfigurations|customPayload)[^ ]*'
  },
  {
    id: 'integration-db',
    title: t('in-server:solis.helpPanel.articles.integrationDB'),
    href: 'https://ibm.biz/dbmarlin',
    route: '/#/config/global/integrations/database[^ ]*'
  },
  {
    id: 'integrtion-logs',
    title: t('in-server:solis.helpPanel.articles.integrtionLogs'),
    href: 'https://ibm.biz/integrating-log',
    route: '/#/config/global/integrations/logging[^ ]*'
  },
  {
    id: 'user-settings',
    title: t('in-server:solis.helpPanel.articles.userSettings'),
    href: 'https://ibm.biz/configuring-user-settings',
    route: '#/config/user/(general|advanced|profile|2fa|personal-api-tokens)[^ ]*'
  },
  {
    id: 'account-billing',
    title: t('in-server:solis.helpPanel.articles.accountAndBilling'),
    href: 'https://ibm.biz/viewing-data-usage-billing',
    route: '/#/config/amp/(usage|licenses|activationAdoption|technologies|account)[^ ]*'
  },
  {
    id: 'security-access',
    title: t('in-server:solis.helpPanel.articles.securityAndAccess'),
    href: 'https://ibm.biz/administering-instana',
    route: '/#/config/securityAndAccess/[^ ]*'
  }
];

const docList = t =>
  getDocConfigs(t).map(config => ({
    id: config.id,
    kind: 'secondary',
    icon_name: 'catalog',
    title: config.title,
    action: {
      type: 'link',
      href: config.href,
      target: '_blank'
    },
    route_regex: config.route
  }));

module.exports = docList;
