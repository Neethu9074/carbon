/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

export type TeamTagUsedEntityType = 'ALERT_CHANNEL' | 'CUSTOM_DASHBOARD';

export interface TeamTagUsedEntity {
  id: TeamTagUsedEntityType;
  title: string;
}
