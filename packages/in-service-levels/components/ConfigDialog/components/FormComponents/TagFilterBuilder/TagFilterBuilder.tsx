/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ApplicationTagFilterBuilder } from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/ApplicationTagFilterBuilder';
import { WebsiteTagFilterBuilder } from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/WebsiteTagFilterBuilder';
import { SloForm, SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm';

interface TagFilterBuilderProps {
  form: SloForm;
  onChange: SloFormOnChange;
}

export const TagFilterBuilder = ({ form, onChange }: TagFilterBuilderProps) => {
  const entityType = form.getIn(['entity', 'type']).value;

  if (entityType === 'application') return <ApplicationTagFilterBuilder form={form} onChange={onChange} />;

  return <WebsiteTagFilterBuilder form={form} onChange={onChange} />;
};
