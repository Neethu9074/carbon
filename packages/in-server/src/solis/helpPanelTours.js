/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const getTourConfigs = t => [
  {
    id: 'kubecost',
    kind: 'primary',
    title: t('in-server:solis.helpPanel.tours.kubernetes'),
    tourId: '2093256',
    route: '/#/kubernetes/(clusters|cluster)[^ ]*'
  },
  {
    id: 'logging',
    kind: 'primary',
    title: t('in-server:solis.helpPanel.tours.logging'),
    tourId: '2094310',
    route: '/#/logging(/(alerts|delete|manage))?[^ ]*'
  },
  {
    id: 'agent',
    kind: 'secondary',
    title: t('in-server:solis.helpPanel.tours.agent'),
    tourId: '1643696',
    route: '/#/(agents|datasources/instanaagent/installation)[^ ]*'
  },
  {
    id: 'invite-users',
    kind: 'secondary',
    title: t('in-server:solis.helpPanel.tours.inviteUsers'),
    tourId: '1643805',
    route: '/#/config/securityAndAccess/accessControl/users$'
  },
  {
    id: 'custom-dashboards',
    kind: 'secondary',
    title: t('in-server:solis.helpPanel.tours.customDashboards'),
    tourId: '1644664',
    route: '/#/customDashboards(/view;dashboardId=[^/?]+)?[^ ]*'
  },
  {
    id: 'maintenance-window',
    kind: 'secondary',
    title: t('in-server:solis.helpPanel.tours.maintenanceWindow'),
    tourId: '1644665',
    route: '/#/config/global/alerting/maintenanceConfigurations$'
  },
  {
    id: 'websites',
    kind: 'secondary',
    title: t('in-server:solis.helpPanel.tours.websites'),
    tourId: '1644666',
    route: '/#/websiteMonitoring/[^ ]*'
  },
  {
    id: 'turbo',
    kind: 'secondary',
    title: t('in-server:solis.helpPanel.tours.turbo'),
    tourId: '2103008',
    route: '/#/(applications|application)[^ ]*'
  },
  {
    id: 'concert',
    kind: 'secondary',
    title: t('in-server:solis.helpPanel.tours.concert'),
    tourId: '2103195',
    route: '/#/(applications|application)[^ ]*'
  }
];

const tourList = t =>
  getTourConfigs(t).map(config => ({
    id: config.id,
    kind: config.kind,
    icon_name: 'tour',
    title: config.title,
    action: {
      type: 'tour',
      tour_id: config.tourId
    },
    route_regex: config.route
  }));

module.exports = tourList;
