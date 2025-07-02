/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// eslint-disable-next-line no-restricted-imports
import { Tearsheet } from '@carbon/ibm-products';
import React from 'react';

import RootCauseAssociatedEvents from 'in-events/components/RootCauseAnalysis/RootCauseAssociatedEvents';
//@ts-expect-error file needs to be converted
import getRawEvents from 'in-subscription/getRawEvents';
import { t } from 'in-i18n';

import locals from './ActionsSection.mless';

interface AssociatedEventsProps {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}

const AssociatedEvents = ({ isOpen, setIsOpen }: AssociatedEventsProps) => {
  return (
    //@ts-expect-error
    <Tearsheet
      id={'associated-events-tearsheet'}
      open={isOpen}
      hasCloseIcon
      onClose={() => setIsOpen(false)}
      closeIconDescription={t('in-events:RCA.close')}
      title={t('in-events:RCA.relatedEventsLabel')}
      description={t('in-events:RCA.associatedEventsDescription')}
    >
      <div className={locals.tearsheetContent}>
        <RootCauseAssociatedEvents />
      </div>
    </Tearsheet>
  );
};

export default AssociatedEvents;
