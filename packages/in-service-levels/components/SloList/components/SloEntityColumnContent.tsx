/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import SloEntityInfo from 'in-service-levels/components/SloList/components/SloEntityInfo';
import { SloListItem, SelectSloListItem } from 'in-service-levels/types';

interface Props {
  item: SloListItem | SelectSloListItem;
}

export default function SloEntityColumnContent({ item }: Props) {
  return <SloEntityInfo entities={item.entities} entityType={item.configuration.entity.type} />;
}
