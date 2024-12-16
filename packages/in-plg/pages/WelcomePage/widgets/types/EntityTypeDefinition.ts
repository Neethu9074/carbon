/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export interface WebsiteEntity {
  id: string;
  type: 'WEBSITE';
}

export interface WebsiteResult {
  type: 'website';
  isWebsite: boolean;
  mainKpiValue: number;
  time: number;
  metrics: Object;
  website: Website;
}

export interface Website {
  id: string;
  label: string;
}

export interface MobileAppResult {
  type: 'mobileApp';
  isMobileApp: boolean;
  healthInfo: Object;
  metrics: Object;
  mobileApp: MobileApp;
}

export interface MobileApp {
  id: string;
  label: string;
}
