/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item } from 'formalistic';
import React from 'react';

import { SloEntityType } from '@instana/types';

import { ApplicationTagFilterBuilder } from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/ApplicationTagFilterBuilder';
import { WebsiteTagFilterBuilder } from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/WebsiteTagFilterBuilder';
import { isApplicationSloForm, SloForm, SloFormPath } from 'in-service-levels/components/ConfigDialog/createSloForm';

interface TagFilterBuilderProps {
  form: SloForm<SloEntityType>;
  onChange: (path: SloFormPath<SloEntityType>, updater: (i: Item) => Item) => void;
}

export const TagFilterBuilder = ({ form, onChange }: TagFilterBuilderProps) => {
  if (isApplicationSloForm(form)) return <ApplicationTagFilterBuilder form={form} onChange={onChange} />;

  return <WebsiteTagFilterBuilder form={form} onChange={onChange} />;
};
