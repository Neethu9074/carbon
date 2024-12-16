/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import QueryBuilder from 'in-infrastructure/Explore/components/QueryBuilder';
import { TagCatalog } from 'in-types';

interface FilterConfiguratorProps {
  tagFilterExpression: FormModelElement[];
  setTagFilterExpression: React.Dispatch<React.SetStateAction<FormModelElement[]>>;
  tagCatalog?: TagCatalog;
  ownerType: string;
}

export default function FilterConfigurator({
  tagFilterExpression,
  setTagFilterExpression,
  tagCatalog,
  ownerType
}: FilterConfiguratorProps) {
  return (
    <QueryBuilderSection
      value={tagFilterExpression}
      QueryBuilder={QueryBuilder}
      tagCatalog={tagCatalog}
      onChange={setTagFilterExpression}
      withoutIcon
      withOptionalMarker
      additionalGetTagCatalogProps={{ ownerType }}
    />
  );
}
