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
import { grouping as groupingFieldName } from 'in-custom-dashboards/widgets/Table/infrastructure/form';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { Group, TagCatalog } from 'in-types';

interface GroupConfiguratorProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  tagFilterExpression: FormModelElement[];
  tagCatalog?: TagCatalog;
  ownerType: string;
}

export default function GroupConfigurator({
  form,
  updateForm,
  tagFilterExpression,
  tagCatalog,
  ownerType
}: GroupConfiguratorProps) {
  const grouping = form.get(groupingFieldName)?.value;

  const onChange = (groups: Group[]) => {
    const filteredGroups = groups.filter(
      (group: Group, index: number) => index === groups.findIndex((item: Group) => group.groupbyTag === item.groupbyTag)
    );

    updateForm(form.updateIn([groupingFieldName], field => field.setValue(filteredGroups).setTouched(true)));
  };

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
      additionalGetTagCatalogProps={{ ownerType }}
    />
  );
}
