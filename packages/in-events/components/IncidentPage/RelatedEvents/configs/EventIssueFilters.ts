/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { t } from 'in-i18n';

const issueFilters = [
  // for issue page specifically
  {
    filterLabel: t('in-events:dataGridEventTable.eventType'),
    filter: {
      type: 'checkbox',
      column: t('in-events:dataGridEventTable.eventType'),
      props: {
        FormGroup: {
          legendText: t('in-events:dataGridEventTable.eventType')
        },
        Checkbox: [
          {
            id: 'built-in',
            labelText: t('in-events:dataGridEventTable.builtIn'),
            value: 'Built-In Event'
          },
          {
            id: 'custom',
            labelText: t('in-events:dataGridEventTable.custom'),
            value: 'Custom Event'
          },
          {
            id: 'application smart alert',
            labelText: t('in-events:dataGridEventTable.appSA'),
            value: 'Application Smart Alert'
          },
          {
            id: 'website smart alert',
            labelText: t('in-events:dataGridEventTable.webSA'),
            value: 'Website Smart Alert'
          },
          {
            id: 'synthetics smart alert',
            labelText: t('in-events:dataGridEventTable.syntheticsSA'),
            value: 'Synthetics Smart Alert'
          },
          {
            id: 'infrastructure smart alert',
            labelText: t('in-events:dataGridEventTable.infraSA'),
            value: 'Infrastructure Smart Alert'
          },
          {
            id: 'mobile smart alert',
            labelText: t('in-events:dataGridEventTable.mobileSA'),
            value: 'Mobile Smart Alert'
          },
          {
            id: 'log smart alert',
            labelText: t('in-events:dataGridEventTable.logSA'),
            value: 'Log Smart Alert'
          },
          {
            id: 'SLO smart alert',
            labelText: t('in-events:dataGridEventTable.sloSa'),
            value: 'SLO Smart Alert'
          }
        ]
      }
    }
  }
];

export default issueFilters;
