/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { t } from 'in-i18n';

export interface Placeholder {
  template: string;
  name: string;
}
export interface PlaceholderListWithTooltip {
  placeholders: ReadonlyArray<Readonly<Placeholder>>;
  tooltip?: string;
}

export const severityPlaceholder: Readonly<Placeholder> = Object.freeze({
  template: '${severity}',
  name: t('in-alerting:smartAlerts.placeholder.severity')
});

export const severityPlaceholderList: Readonly<Array<Placeholder>> = [severityPlaceholder];
