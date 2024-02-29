/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import { DynamicTagList } from 'in-components/TagsList/DynamicTagList';

interface Props {
  item: SloListItem;
}

export default function SloEntityColumnContent({ item }: Props) {
  const { tags } = item.configuration;

  return <DynamicTagList tags={tags} />;
}
