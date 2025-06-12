/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link, Typography } from '@instana/components';

import useGetHrefToSloDashboard from 'in-service-levels/navigation/hooks/useGetHrefToSloDashboard';
import { SloListItem, SelectSloListItem } from 'in-service-levels/types';

interface Props {
  item: SloListItem | SelectSloListItem;
  isLink?: boolean;
}

export default function SloNameColumnContent({ item, isLink = false }: Props) {
  const hrefToSloDashboard = useGetHrefToSloDashboard();
  const { configuration } = item;
  const { name, id } = configuration;
  if (isLink) {
    return (
      <Link href={hrefToSloDashboard(id!)} ellipsis>
        {name}
      </Link>
    );
  }
  return <Typography variant="body-regular">{name}</Typography>;
}
