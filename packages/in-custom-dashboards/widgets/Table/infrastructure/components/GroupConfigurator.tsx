/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

// @ts-expect-error
import GroupingConfigurator from 'in-infrastructure/Explore/components/GroupingConfigurator';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { Grouping, TagCatalog } from 'in-types';

interface GroupConfiguratorProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  tagFilterExpression: FormModelElement[];
  tagCatalog?: TagCatalog;
}

export default function GroupConfigurator({
  form,
  updateForm,
  tagFilterExpression,
  tagCatalog
}: GroupConfiguratorProps) {
  const grouping = form.get('grouping')?.value;

  const onChange = (group: Grouping) =>
    updateForm(form.updateIn(['grouping'], field => field.setValue(group).setTouched(true)));

  return (
    <GroupingConfiguratorSection
      value={grouping}
      GroupingConfigurator={GroupingConfigurator}
      tagCatalog={tagCatalog}
      tagFilterExpression={tagFilterExpression}
      withoutIcon
      withOptionalMarker
      onChange={onChange}
      tracking={{
        onGroupAdded: () => null,
        onGroupRemoved: () => null
      }}
    />
  );
}
