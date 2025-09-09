/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const getDocConfigs = t => [
  // home page
  {
    id: 'Overview',
    title: t('in-server:solis.helpPanel.articles.home'),
    href: 'https://ibm.biz/insta_topics',
    route: '/home([?#].*)?$'
  },
  {
    id: 'getting-started',
    title: t('in-server:solis.helpPanel.articles.homeGetStarted'),
    href: 'https://ibm.biz/insta-getstarted',
    route: '/home([?#].*)?$'
  },

  {
    id: 'getting-started-with-instana',
    title: t('in-server:solis.helpPanel.articles.homeGetStartedWithInstana'),
    href: 'https://ibm.biz/insta_getting_started',
    route: '/home([?#].*)?$'
  },
  {
    id: 'self-hosted',
    title: t('in-server:solis.helpPanel.articles.homeInstallingAndConfiguringSH'),
    href: 'https://ibm.biz/cluster-system',
    route: '/home([?#].*)?$'
  },
  //websites
  {
    id: 'websites',
    title: t('in-server:solis.helpPanel.articles.websites'),
    href: 'https://ibm.biz/monitoring-websites',
    route: '/#/websiteMonitoring/[^ ]*'
  },
  {
    id: 'websites-faq',
    title: t('in-server:solis.helpPanel.articles.websitesFaq'),
    href: 'https://ibm.biz/web-FAQ',
    route: '/#/websiteMonitoring/[^ ]*'
  },
  {
    id: 'websites-backend',
    title: t('in-server:solis.helpPanel.articles.websitesBackend'),
    href: 'https://ibm.biz/web-backend',
    route: '/#/websiteMonitoring/[^ ]*'
  },
  //mobile-apps
  {
    id: 'mobile-apps',
    title: t('in-server:solis.helpPanel.articles.mobileApps'),
    href: 'https://ibm.biz/mob-app',
    route: '/#/mobileAppMonitoring/[^ ]*'
  },
  {
    id: 'mobile-apps-faq',
    title: t('in-server:solis.helpPanel.articles.mobileAppsFaq'),
    href: 'https://ibm.biz/mob-monitoring-faq',
    route: '/#/mobileAppMonitoring/[^ ]*'
  },
  {
    id: 'mobile-apps-alerts',
    title: t('in-server:solis.helpPanel.articles.mobileAppsAlerts'),
    href: 'https://ibm.biz/mob-app-smart-alerts',
    route: '/#/mobileAppMonitoring/[^ ]*'
  },
  //bizops
  {
    id: 'bizops',
    title: t('in-server:solis.helpPanel.articles.businessProcesses'),
    href: 'https://ibm.biz/business-processes',
    route: '/#/businessProcesses[^ ]*|/#/businessPerspectives[^ ]*|/#/businessProcess[^ ]*'
  },
  //application-perspective
  {
    id: 'applications',
    title: t('in-server:solis.helpPanel.articles.applications'),
    href: 'https://ibm.biz/monitoring-applications',
    route: '/#/(applications|application)[^ ]*'
  },
  {
    id: 'application-perspective',
    title: t('in-server:solis.helpPanel.articles.applicationPerspective'),
    href: 'https://ibm.biz/app-perspective',
    route: '/#/(applications|application)[^ ]*'
  },
  //services
  {
    id: 'services',
    title: t('in-server:solis.helpPanel.articles.services'),
    href: 'https://ibm.biz/app-services',
    route: '/#/(services|service)[^ ]*'
  },
  //smart alerts
  {
    id: 'smart-alerts',
    title: t('in-server:solis.helpPanel.articles.smartAlerts'),
    href: 'https://ibm.biz/applications-smart-alerts',
    route: '/#/alerts[^ ]*'
  },
  //platforms cloud foundry
  {
    id: 'cloud-foundry',
    title: t('in-server:solis.helpPanel.articles.cloudFoundry'),
    href: 'https://ibm.biz/monitoring-cloud-foundry-vmware-tanzu',
    route: '/#/cloudfoundry/application[^ ]*'
  },
  {
    id: 'cloud-foundry-microservices-apps',
    title: t('in-server:solis.helpPanel.articles.cloudFoundryMicroservices'),
    href: 'https://ibm.biz/microservices-app',
    route: '/#/cloudfoundry/application[^ ]*'
  },
  //platforms powerHMC
  {
    id: 'powerHMC',
    title: t('in-server:solis.helpPanel.articles.powerHMC'),
    href: 'https://ibm.biz/monitoring-power-hmc',
    route: '/#/ibmp/(phmcs|systems)[^ ]*'
  },
  //platforms powerVC
  {
    id: 'powerVC-openstack',
    title: t('in-server:solis.helpPanel.articles.configureMicroService'),
    href: 'https://ibm.biz/insta-agent-vmtanzu-docs',
    route: '/#/(powervc|openstack)/regions[^ ]*'
  },
  //platforms zHMC
  {
    id: 'zHMC',
    title: t('in-server:solis.helpPanel.articles.zHMC'),
    href: 'https://ibm.biz/monitoring-z-hmc',
    route: '/#/ibmz/(zhmcs|systems)[^ ]*'
  },
  //platforms kubernetes
  {
    id: 'kubernetes',
    title: t('in-server:solis.helpPanel.articles.kubernetes'),
    href: 'https://ibm.biz/monitoring-kubernetes',
    route: '/#/kubernetes/(clusters|cluster)[^ ]*'
  },
  {
    id: 'kubernetes-autotrace',
    title: t('in-server:solis.helpPanel.articles.instanaAutotrace'),
    href: 'https://ibm.biz/autotrace-webhook',
    route: '/#/kubernetes/(clusters|cluster)[^ ]*'
  },
  //platforms nutanix
  {
    id: 'nutanix',
    title: t('in-server:solis.helpPanel.articles.nutanix'),
    href: 'https://ibm.biz/monitoring-nutanix',
    route: '/#/nutanix/datacenters[^ ]*'
  },
  //platforms vSphere
  {
    id: 'vSphere',
    title: t('in-server:solis.helpPanel.articles.vSphere'),
    href: 'https://ibm.biz/monitoring-vsphere',
    route: '/#/vsphere/datacenters[^ ]*'
  },
  //infrastructure
  {
    id: 'monitor-infrastructure',
    title: t('in-server:solis.helpPanel.articles.infrastructureMonitor'),
    href: 'https://ibm.biz/monitoring-infrastructure',
    route: '/#/(physical|container)(/dashboard)?[^ ]*'
  },
  {
    id: 'infrastructure-map',
    title: t('in-server:solis.helpPanel.articles.infrastructureMap'),
    href: 'https://ibm.biz/infrastructure-map',
    route: '/#/(physical|container)(/dashboard)?[^ ]*'
  },
  {
    id: 'infrastructure-metrics',
    title: t('in-server:solis.helpPanel.articles.infrastructureMetrics'),
    href: 'https://ibm.biz/infrastructure-metrics',
    route: '/#/(physical|container)(/dashboard)?[^ ]*'
  },
  {
    id: 'infrastructure-alerts',
    title: t('in-server:solis.helpPanel.articles.infrastructureAlerts'),
    href: 'https://ibm.biz/infra-smart-alerts',
    route: '/#/(physical|container)(/dashboard)?[^ ]*'
  },
  //custom dashboards
  {
    id: 'custom-dashboards',
    title: t('in-server:solis.helpPanel.articles.customDashboards'),
    href: 'https://ibm.biz/custom-dashboards',
    route: '/#/customDashboards(/view;dashboardId=[^/?]+)?[^ ]*'
  },
  {
    id: 'custom-dashboards-table',
    title: t('in-server:solis.helpPanel.articles.tableWidget'),
    href: 'https://ibm.biz/creating-table-widget',
    route: '/#/customDashboards(/view;dashboardId=[^/?]+)?[^ ]*'
  },
  // logging
  {
    id: 'logging',
    title: t('in-server:solis.helpPanel.articles.logging'),
    href: 'https://ibm.biz/instana-logging',
    route: '/#/logging(/(alerts|delete|manage))?[^ ]*'
  },
  {
    id: 'log-retention',
    title: t('in-server:solis.helpPanel.articles.logRetention'),
    href: 'https://ibm.biz/extended-log-retention',
    route: '/#/logging(/(alerts|delete|manage))?[^ ]*'
  },
  {
    id: 'log-volume-report',
    title: t('in-server:solis.helpPanel.articles.logVolReport'),
    href: 'https://ibm.biz/viewing-log-volumn-report',
    route: '/#/logging(/(alerts|delete|manage))?[^ ]*'
  },
  //synthetics
  {
    id: 'synthetic-monitoring',
    title: t('in-server:solis.helpPanel.articles.syntheticMonitoring'),
    href: 'https://ibm.biz/synthetic-monitoring',
    route: '/#/(syntheticTests|syntheticLocations|syntheticCredentials|syntheticSmartAlerts|synthetic)[^ ]*'
  },
  {
    id: 'synthetic-monitoring-permission',
    title: t('in-server:solis.helpPanel.articles.syntheticPermissions'),
    href: 'https://ibm.biz/synthetic-permission',
    route: '/#/(syntheticTests|syntheticLocations|syntheticCredentials|syntheticSmartAlerts|synthetic)[^ ]*'
  },
  {
    id: 'synthetic-monitoring-alerts',
    title: t('in-server:solis.helpPanel.articles.syntheticMonitoringAlerts'),
    href: 'https://ibm.biz/synthetics-smart-alerts',
    route: '/#/(syntheticTests|syntheticLocations|syntheticCredentials|syntheticSmartAlerts|synthetic)[^ ]*'
  },
  //analyze
  {
    id: 'analyze-traces',
    title: t('in-server:solis.helpPanel.articles.analyzeTraces'),
    href: 'https://ibm.biz/analyzing-traces-calls',
    route: '/#/analyze[^ ]*'
  },
  {
    id: 'root-cause-analysis',
    title: t('in-server:solis.helpPanel.articles.rootCauseAnalysis'),
    href: 'https://ibm.biz/insta-root-cause-analysis',
    route: '/#/analyze[^ ]*'
  },
  {
    id: 'analyze-infrastructure',
    title: t('in-server:solis.helpPanel.articles.analyzeInfrastructure'),
    href: 'https://ibm.biz/analyze-infrastructure',
    route: '/#/(explore|profiles/analyzeProfiles)[^ ]*'
  },
  //vulnerabilities
  {
    id: 'concert',
    title: t('in-server:solis.helpPanel.articles.concert'),
    href: 'https://ibm.biz/viewing-data',
    route: '/#/vulnerability-center(/detection)?[^ ]*'
  },
  //automation
  {
    id: 'automation',
    title: t('in-server:solis.helpPanel.articles.automation'),
    href: 'https://ibm.biz/managing-actions',
    route: '/#/automation/(actionCatalog(/actionDashboard)?|actionHistory|policies)[^ ]*'
  },
  {
    id: 'automation-policies',
    title: t('in-server:solis.helpPanel.articles.automationPolicies'),
    href: 'https://ibm.biz/automation-policies',
    route: '/#/automation/(actionCatalog(/actionDashboard)?|actionHistory|policies)[^ ]*'
  },
  //slo
  {
    id: 'slo',
    title: t('in-server:solis.helpPanel.articles.slo'),
    href: 'https://ibm.biz/service-level-objectives-slos',
    route: '/#/slo(/(alerts|correctionWindows|objective))?[^ ]*'
  },
  {
    id: 'slo-alerts',
    title: t('in-server:solis.helpPanel.articles.sloAlerts'),
    href: 'https://ibm.biz/SLO-smart-alerts',
    route: '/#/slo(/(alerts|correctionWindows|objective))?[^ ]*'
  },
  {
    id: 'slo-correction-window',
    title: t('in-server:solis.helpPanel.articles.sloCorrectionWindow'),
    href: 'https://ibm.biz/SLO-correction-windows',
    route: '/#/slo(/(alerts|correctionWindows|objective))?[^ ]*'
  },
  {
    id: 'slo-config-example',
    title: t('in-server:solis.helpPanel.articles.sloConfigExample'),
    href: 'https://ibm.biz/SLO-configuration-examples',
    route: '/#/slo(/(alerts|correctionWindows|objective))?[^ ]*'
  },
  //agents and collectors
  {
    id: 'agents',
    title: t('in-server:solis.helpPanel.articles.agents'),
    href: 'https://ibm.biz/installing-agent',
    route: '/#/datasources/(instanaagent|otelcollector)(/installation)?[^ ]*'
  },
  {
    id: 'host-agents',
    title: t('in-server:solis.helpPanel.articles.hostAgents'),
    href: 'https://ibm.biz/configuraing-host',
    route: '/#/datasources/(instanaagent|otelcollector)(/installation)?[^ ]*'
  },
  //settings
  {
    id: 'events-alerts',
    title: t('in-server:solis.helpPanel.articles.eventsAndAlerts'),
    href: 'https://ibm.biz/managing-events-alerts',
    route:
      '/#/config/global/alerting/(events|alerts|channels|maintenanceConfigurations|customPayload)[^ ]*|/#/events[^ ]*'
  },
  {
    id: 'events-alerts-builtin',
    title: t('in-server:solis.helpPanel.articles.builtinEvents'),
    href: 'https://ibm.biz/built-in_issues',
    route:
      '/#/config/global/alerting/(events|alerts|channels|maintenanceConfigurations|customPayload)[^ ]*|/#/events[^ ]*'
  },
  {
    id: 'events-alerts-custom',
    title: t('in-server:solis.helpPanel.articles.customEvents'),
    href: 'https://ibm.biz/custom-events',
    route:
      '/#/config/global/alerting/(events|alerts|channels|maintenanceConfigurations|customPayload)[^ ]*|/#/events[^ ]*'
  },
  {
    id: 'integration-db',
    title: t('in-server:solis.helpPanel.articles.integrationDB'),
    href: 'https://ibm.biz/dbmarlin',
    route: '/#/config/global/integrations/database[^ ]*'
  },
  {
    id: 'grafana',
    title: t('in-server:solis.helpPanel.articles.grafana'),
    href: 'https://ibm.biz/insta-grafana',
    route: '/#/config/global/integrations/database[^ ]*'
  },
  {
    id: 'integrtion-logs',
    title: t('in-server:solis.helpPanel.articles.integrtionLogs'),
    href: 'https://ibm.biz/integrating-log',
    route: '/#/config/global/integrations/logging[^ ]*'
  },
  {
    id: 'integrtion-logs-alerts',
    title: t('in-server:solis.helpPanel.articles.logAlerts'),
    href: 'https://ibm.biz/logging-smart-alerts',
    route: '/#/config/global/integrations/logging[^ ]*'
  },
  {
    id: 'user-settings',
    title: t('in-server:solis.helpPanel.articles.userSettings'),
    href: 'https://ibm.biz/configuring-user-settings',
    route: '#/config/user/(general|advanced|profile|2fa|personal-api-tokens)[^ ]*'
  },
  {
    id: 'security-access',
    title: t('in-server:solis.helpPanel.articles.securityAndAccess'),
    href: 'https://ibm.biz/administering-instana',
    route: '/#/config/securityAndAccess/[^ ]*'
  },
  {
    id: 'user-access',
    title: t('in-server:solis.helpPanel.articles.userAccess'),
    href: 'https://ibm.biz/managing-user-access',
    route: '/#/config/securityAndAccess/[^ ]*'
  },
  {
    id: 'security-access',
    title: t('in-server:solis.helpPanel.articles.configuringAuthentication'),
    href: 'https://ibm.biz/insta-configuring-authentication',
    route: '/#/config/securityAndAccess/[^ ]*'
  },
  //account and billing
  {
    id: 'account-billing',
    title: t('in-server:solis.helpPanel.articles.accountAndBilling'),
    href: 'https://ibm.biz/viewing-data-usage-billing',
    route: '/#/accountAndBilling/amp/[^ ]*$'
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
