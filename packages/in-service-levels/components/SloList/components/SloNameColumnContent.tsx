/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link } from '@instana/components';

import useGetHrefToSloDashboard from 'in-service-levels/navigation/hooks/useGetHrefToSloDashboard';
import { SloListItem } from 'in-service-levels/types';

interface Props {
  item: SloListItem;
}

export default function SloNameColumnContent({ item }: Props) {
  const hrefToSloDashboard = useGetHrefToSloDashboard();
  const { configuration } = item;
  const { name, id } = configuration;
  return (
    <Link href={hrefToSloDashboard(id!)} ellipsis>
      {name}
    </Link>
  );
}
