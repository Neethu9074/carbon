/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ApplicationTagFilterBuilderContent from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/ApplicationTagFilterBuilderContent';
import DisabledTagFilterButton from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/DisabledTagFilterButton';
import { SloForm, SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm';

interface ApplicationTagFilterBuilderProps {
  form: SloForm;
  onChange: SloFormOnChange;
  readOnly?: boolean;
  width?: string;
}

export default function ApplicationTagFilterBuilder({
  form,
  onChange,
  readOnly = false,
  width
}: ApplicationTagFilterBuilderProps) {
  const applicationIdField = form.getIn(['entity', 'entityId']);
  const boundaryScopeField = form.getIn(['scope', 'boundaryScope']);

  const isScopeSelected = boundaryScopeField.value && applicationIdField.value;

  if (!isScopeSelected) return <DisabledTagFilterButton />;

  return <ApplicationTagFilterBuilderContent form={form} onChange={onChange} readOnly={readOnly} width={width} />;
}
