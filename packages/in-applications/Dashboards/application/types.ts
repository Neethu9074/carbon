/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Application, ApplicationBoundaryScope, EndpointType, TimeConfig } from '@instana/types';

export interface ApplicationTabProps {
  applicationId: string;
  viewPath: string;
  timeConfig: TimeConfig;
  boundaryScope: ApplicationBoundaryScope;
  onChange: (args: any) => void;
  location: Location;
  currentTab: string;
  onBoundaryStateChange: (args: any) => void;
  endpointTypes?: EndpointType[];
  data: Application;
  serviceId?: string;
  endpointId?: string;
}
