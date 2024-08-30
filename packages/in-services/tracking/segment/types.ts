/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export interface PageTrackerProps {
  productArea: string;
  pageRootName: string;
}

export interface currentUnitProps {
  tenantId: string;
  tenantUnitId: string;
  tenantUnitName: string;
  tenantName: string;
}
export interface UsageInfoProps {
  activeLicenseType: string;
}

export interface EventTrackerProps {
  data: DataProps;
  segmentEventName: string;
}

interface DataProps {
  parentPageName: string;
  parentPageCategory: string;
  path: string;
  CTA?: string;
  objectType?: string;
  processType?: string;
}
