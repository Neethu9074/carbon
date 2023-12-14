/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, Typography } from '@instana/components';

import OnboardingExpandCard from 'in-plg/components/Card/ExpandableCard/OnboardingExpandCard';
import { t } from 'in-i18n';

interface SupportViewItem {
  title: string;
  body: JSX.Element;
  openByDefault: boolean;
}

export default function SupportViewSection({ items }: { items: SupportViewItem[] }): JSX.Element {
  return (
    <Stack>
      <Typography variant="body-bold">{t('in-plg:agentDetails.common.support')}</Typography>
      {items.map((sideCard, index) => (
        <OnboardingExpandCard
          key={index}
          title={sideCard.title}
          body={sideCard.body}
          openByDefault={sideCard.openByDefault}
        />
      ))}
    </Stack>
  );
}
