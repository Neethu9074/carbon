/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

import { isUndefined } from 'lodash';

import { EVENT_KINDS } from 'in-events/components/EventsPage/EventsTable/types';
import { eventsTransientEventEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

// Define the interface here to avoid circular imports
export interface FilterValue {
  id: string;
  label: string;
  dfq: string;
  checked: boolean;
  type: string;
  disabled?: boolean;
  radioGroup?: string;
}

export interface FilterSection {
  label: string;
  filters: FilterValue[];
}

const getEventFilterSections: (eventType: EVENT_KINDS) => FilterSection[] = eventType => {
  const shouldShowTransientEvents = eventsTransientEventEnabled && (isUndefined(eventType) || eventType === 'issue');

  const EventFilterSections: FilterSection[] = [
    // Conditionally add the entire Transient events section if feature flag is enabled
    ...(shouldShowTransientEvents
      ? [
          {
            label: t('in-events:dataGridEventTable.transient'),
            filters: [
              {
                id: 'transient-all',
                label: t('in-events:dataGridEventTable.showAll'),
                dfq: '',
                checked: true, // Default to show all events
                type: 'radio',
                radioGroup: 'transient'
              },
              {
                id: 'transient-only',
                label: t('in-events:dataGridEventTable.showTransientOnly'),
                dfq: 'event.isTransient:true',
                checked: false,
                type: 'radio',
                radioGroup: 'transient'
              },
              {
                id: 'non-transient-only',
                label: t('in-events:dataGridEventTable.showNonTransientOnly'),
                dfq: 'event.isTransient:false',
                checked: false,
                type: 'radio',
                radioGroup: 'transient'
              }
            ]
          }
        ]
      : []),
    {
      label: t('in-events:dataGridEventTable.eventType'),
      filters: [
        {
          id: 'built-in',
          label: t('in-events:dataGridEventTable.builtIn'),
          dfq: 'event.configuration:"Built-In Event"',
          checked: false,
          type: 'checkbox'
        },
        {
          id: 'custom',
          label: t('in-events:dataGridEventTable.custom'),
          dfq: 'event.configuration:"Custom Event"',
          checked: false,
          type: 'checkbox'
        }
      ]
    },
    {
      label: 'Smart alerts',
      filters: [
        {
          id: 'application smart alert',
          label: t('in-events:dataGridEventTable.appSA'),
          dfq: 'event.configuration:"Application Smart Alert"',
          checked: false,
          type: 'checkbox'
        },
        {
          id: 'website smart alert',
          label: t('in-events:dataGridEventTable.webSA'),
          dfq: 'event.configuration:"Website Smart Alert"',
          checked: false,
          type: 'checkbox'
        },
        {
          id: 'synthetics smart alert',
          label: t('in-events:dataGridEventTable.syntheticsSA'),
          dfq: 'event.configuration:"Synthetics Smart Alert"',
          checked: false,
          type: 'checkbox'
        },
        {
          id: 'infrastructure smart alert',
          label: t('in-events:dataGridEventTable.infraSA'),
          dfq: 'event.configuration:"Infrastructure Smart Alert"',
          checked: false,
          type: 'checkbox'
        },
        {
          id: 'mobile smart alert',
          label: t('in-events:dataGridEventTable.mobileSA'),
          dfq: 'event.configuration:"Mobile Smart Alert"',
          checked: false,
          type: 'checkbox'
        },
        {
          id: 'log smart alert',
          label: t('in-events:dataGridEventTable.logSA'),
          dfq: 'event.configuration:"Log Smart Alert"',
          checked: false,
          type: 'checkbox'
        },
        {
          id: 'SLO smart alert',
          label: t('in-events:dataGridEventTable.sloSa'),
          dfq: 'event.configuration:"SLO Smart Alert"',
          checked: false,
          type: 'checkbox'
        }
      ]
    }
  ];

  return EventFilterSections;
};

export default getEventFilterSections;
