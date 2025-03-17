/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Edit } from '@carbon/icons-react';
import React from 'react';

import { CarbonInlineLoading, Typography } from '@instana/components';
import { ProductiveCard } from '@instana/ibm-products';

import config from 'in-services/config';
import { t } from 'in-i18n';

interface TeamScopeProps {
  isLoading: boolean;
}

const TeamScope = ({ isLoading }: TeamScopeProps) => {
  return (
    <ProductiveCard
      actionIcons={[
        {
          icon: Edit,
          iconDescription: t('in-settings:tabs.teams.edit'),
          id: '1',
          onClick: () => {}
        }
      ]}
      title={t('in-settings:tabs.teams.teamScope')}
    >
      {isLoading && <CarbonInlineLoading />}
      {!isLoading && (
        <>
          <Typography variant="heading-03">
            {config.tenantUnit}-{config.tenant}
          </Typography>
          <Typography variant="body-01">{t('in-settings:tabs.teams.teamScopeNotDefinedMessage')}</Typography>
        </>
      )}
    </ProductiveCard>
  );
};

export default TeamScope;
