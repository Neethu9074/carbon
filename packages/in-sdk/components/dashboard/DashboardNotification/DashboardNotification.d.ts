/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ReactNode } from 'react';

interface DashboardNotificationProps {
  children: ReactNode;
  type: string;
}

declare function DashboardNotification(props: DashboardNotificationProps): JSX.Element;

export default DashboardNotification;
