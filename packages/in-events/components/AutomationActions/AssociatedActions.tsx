/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

// @ts-expect-error
import EventSpecificationLink from 'in-events/components/legacy/EventSpecificationLink';
import { t } from 'in-i18n';

export default function AssociatedActions({ event }: { event: any }) {
  return (
    <div>
      <EventSpecificationLink event={event} buttonText={t('in-events:setAssociations')} />
    </div>
  );
}
