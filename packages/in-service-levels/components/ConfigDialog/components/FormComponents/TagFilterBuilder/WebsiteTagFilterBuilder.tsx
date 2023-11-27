/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import WebsiteTagBuilderContent from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/WebsiteTagBuilderContent';
import DisabledTagFilterButton from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/DisabledTagFilterButton';
import { SloForm, SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm';

interface WebsiteTagFilterBuilderProps {
  form: SloForm;
  onChange: SloFormOnChange;
  readOnly?: boolean;
  width?: string;
}

export default function WebsiteTagFilterBuilder({
  form,
  onChange,
  readOnly = false,
  width
}: WebsiteTagFilterBuilderProps) {
  const beaconTypeField = form.getIn(['scope', 'beaconType']);
  const websiteIdField = form.getIn(['entity', 'entityId']);

  const isScopeSelected = beaconTypeField.value && websiteIdField.value;

  if (!isScopeSelected) return <DisabledTagFilterButton />;

  return <WebsiteTagBuilderContent form={form} onChange={onChange} readOnly={readOnly} width={width} />;
}
