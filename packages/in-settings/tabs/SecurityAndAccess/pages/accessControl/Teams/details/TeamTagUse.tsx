/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonInlineLoading, Typography } from '@instana/components';
import { ProductiveCard } from '@instana/ibm-products';

import { t } from 'in-i18n';

interface TeamTagUseProps {
  isLoading: boolean;
}

const TeamTagUse = ({ isLoading }: TeamTagUseProps) => {
  return (
    <ProductiveCard title={t('in-settings:tabs.teams.teamTagUsedOn')}>
      {isLoading && <CarbonInlineLoading />}
      {!isLoading && (
        <>
          <Typography variant="heading-03">{t('in-settings:tabs.teams.noDataYet')}</Typography>
          <Typography variant="body-01">{t('in-settings:tabs.teams.teamTagUsedOnEntitiesMessage')}</Typography>
        </>
      )}
    </ProductiveCard>
  );
};

export default TeamTagUse;
