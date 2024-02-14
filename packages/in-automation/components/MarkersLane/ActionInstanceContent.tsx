/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ActionlaneDialogControls from 'in-automation/components/MarkersLane/ActionlaneDialogControls';
import { ActionListCalloutProps } from 'in-automation/components/MarkersLane/shared';
import DetailTab from 'in-automation/components/ActionHistory/DetailTab';
import { ActionInstance } from 'in-types';

import locals from './ActionInstanceContent.mless';

export default function ActionInstanceContent({
  actionInstance,
  eventData
}: {
  actionInstance: ActionInstance;
  eventData: ActionListCalloutProps;
}) {
  return (
    <div className={locals.container}>
      <div className={locals.headline}>{actionInstance.actionName}</div>

      <div className={locals.detailsTable}>
        <DetailTab id={actionInstance.actionInstanceId ?? ''} properties={actionInstance} inActionLane />
      </div>

      <div className={locals.controls}>
        <ActionlaneDialogControls actionId={actionInstance.actionId} eventData={eventData} />
      </div>
    </div>
  );
}
