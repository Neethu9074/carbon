/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Event, TriggerType } from '@instana/types';
import { Button } from '@instana/components';

import { getTriggerIdFromEvent, getTriggerTypeFromEvent } from 'in-automation/AutomationCard/shared';
import CreateNewPolicyTearsheet from 'in-automation/Policies/CreateNewPolicyTearsheet';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

export interface TriggerDetailsProps {
  triggerId: string;
  triggerType: TriggerType;
}
export default function CreatePolicyButton({ event }: { event: Event }) {
  const triggerDetails: TriggerDetailsProps = {
    triggerId: getTriggerIdFromEvent(event),
    triggerType: getTriggerTypeFromEvent(event)
  };

  return (
    <Button
      kind="action"
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        handleButtonClick({ triggerDetails });
      }}
      icon="lib_openclose_add_circle_outline"
    >
      {t('in-automation:createPolicy')}
    </Button>
  );
}

const handleButtonClick = ({ triggerDetails }: { triggerDetails: TriggerDetailsProps }) => {
  addActiveDialog(<CreateNewPolicyTearsheet triggerDetails={triggerDetails} inEventPage />);
};
