/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { DynamicTagList } from 'in-components/TagsList/DynamicTagList';
import { t } from 'in-i18n';

export const tagsColumn: ColumnDefinition<{ tags: string[] }> = {
  label: t('in-automation:tags'),
  id: 'tags',
  width: 10,
  getContent(item) {
    const { tags = [] } = item;
    return <DynamicTagList tags={tags} />;
  }
};
