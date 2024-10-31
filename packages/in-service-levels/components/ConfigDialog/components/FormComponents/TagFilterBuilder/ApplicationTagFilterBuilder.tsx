/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { StackItem } from '@instana/components';

import ApplicationTagFilterBuilderContent from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/ApplicationTagFilterBuilderContent';
import DisabledTagFilterButton from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/DisabledTagFilterButton';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';

export default function ApplicationTagFilterBuilder() {
  const { form } = useContext(SloFormContext);
  const applicationIdField = form.getIn(['entity', 'entityIds']);
  const boundaryScopeField = form.getIn(['scope', 'boundaryScope']);
  const isScopeSelected = boundaryScopeField.value && applicationIdField.value[0];

  return !isScopeSelected ? (
    <StackItem>
      <DisabledTagFilterButton noCustomTitle />
    </StackItem>
  ) : (
    <ApplicationTagFilterBuilderContent />
  );
}
