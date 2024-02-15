/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

import { SloListItem } from 'in-service-levels/components/SloList/SloList';

interface Props {
  item: SloListItem;
}

export default function SloBlueprintColumnContent({ item }: Props) {
  const { indicator } = item.configuration;

  return (
    <Typography variant="body-regular">
      {t('in-service-levels:general.indicator.blueprint', {
        context: indicator.blueprint
      })}
    </Typography>
  );
}
