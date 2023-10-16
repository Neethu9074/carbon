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
  analytics: 'Analytics',
  events: 'Events',
  slo: 'Slo',
  settings: 'Settings',
  bizops: 'BizOps',
  cloud_foundry: 'Platforms - Cloud Foundry',
  ibmZ: 'Platforms - IBM Z HMC',
  kubernetes: 'Platforms - Kubernetes',
  vsphere: 'Platforms - vSphere',
  openstack: 'Platforms - Openstack',
  ibmpower: 'Platforms - IBM Power HMC',
  sap: 'Platforms - SAP',
  custom_dashboard: 'Custom Dashboard',
  agents: 'Agents',
  power_vc: 'PowerVC'
} as const);

type ProductAreaKey = keyof typeof productAreas;
export type ProductArea = (typeof productAreas)[ProductAreaKey];
