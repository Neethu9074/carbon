/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SloDynamicTagList } from 'in-service-levels/components/TagsList/SloDynamicTagList';
import { SloListItem } from 'in-service-levels/components/SloList/SloList';

interface Props {
  item: SloListItem;
}

export default function SloEntityColumnContent({ item }: Props) {
  const { tags } = item.configuration;

  return <SloDynamicTagList tags={tags} />;
}
