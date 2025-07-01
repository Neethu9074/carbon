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
  prc: 'Probable Root Cause',
  event: 'Event',
  events: 'Events',
  slo: 'Service Level Objectives',
  settings: 'Settings',
  bizops: 'Business Monitoring',
  cloud_foundry: 'Platforms - Cloud Foundry',
  ibmZ: 'Platforms - IBM Z HMC',
  kubernetes: 'Platforms - Kubernetes',
  linuxkvmhypervisor: 'Linux KVM Hypervisor',
  vsphere: 'Platforms - vSphere',
  openstack: 'Platforms - Openstack',
  ibmpower: 'Platforms - IBM Power HMC',
  nutanix: 'Platforms - Nutanix',
  windowshypervisor: 'Platforms - Windows Hypervisor',
  xenserver: 'Platforms - XenServer',
  sap: 'Platforms - SAP',
  custom_dashboard: 'Custom Dashboard',
  agents: 'Agents',
  power_vc: 'PowerVC',
  automation: 'Automation',
  vulnerability: 'Vulnerability',
  data_sources: 'Data Sources'
} as const);

type ProductAreaKey = keyof typeof productAreas;
export type ProductArea = (typeof productAreas)[ProductAreaKey];
