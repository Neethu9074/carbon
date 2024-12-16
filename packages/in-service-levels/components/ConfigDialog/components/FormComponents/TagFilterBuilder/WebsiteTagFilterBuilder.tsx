/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import WebsiteTagBuilderContent from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/WebsiteTagBuilderContent';
import DisabledTagFilterButton from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/DisabledTagFilterButton';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';

interface WebsiteTagFilterBuilderProps {
  readOnly?: boolean;
  width?: string;
}

export default function WebsiteTagFilterBuilder({ readOnly = false, width }: WebsiteTagFilterBuilderProps) {
  const { form, onChange } = useContext(SloFormContext);

  const beaconTypeField = form.getIn(['scope', 'beaconType']);
  const websiteIdField = form.getIn(['entity', 'entityIds']);

  const isScopeSelected = beaconTypeField.value && websiteIdField.value[0];

  if (!isScopeSelected) return <DisabledTagFilterButton width={width} />;

  return <WebsiteTagBuilderContent form={form} onChange={onChange} readOnly={readOnly} width={width} />;
}
