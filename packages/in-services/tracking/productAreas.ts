/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export const productAreas = Object.freeze({
  home: 'Home',
  websites_mobile_apps: 'Websites & Mobile Apps',
  applications: 'Applications',
  infrastructure: 'Infrastructure',
  synthetic_monitoring: 'Synthetic Monitoring',
  logging: 'Logging',
  analytics: 'Analytics',
  event: 'Event',
  events: 'Events',
  slo: 'Service Level Objectives',
  settings: 'Settings',
  bizops: 'Business Monitoring',
  cloud_foundry: 'Platforms - Cloud Foundry',
  ibmZ: 'Platforms - IBM Z HMC',
  kubernetes: 'Platforms - Kubernetes',
  vsphere: 'Platforms - vSphere',
  openstack: 'Platforms - Openstack',
  ibmpower: 'Platforms - IBM Power HMC',
  nutanix: 'Platforms - Nutanix',
  sap: 'Platforms - SAP',
  xenserver: 'Platforms - XenServer',
  custom_dashboard: 'Custom Dashboard',
  agents: 'Agents',
  power_vc: 'PowerVC',
  automation: 'Automation',
  vulnerability: 'Vulnerability'
} as const);

type ProductAreaKey = keyof typeof productAreas;
export type ProductArea = (typeof productAreas)[ProductAreaKey];
