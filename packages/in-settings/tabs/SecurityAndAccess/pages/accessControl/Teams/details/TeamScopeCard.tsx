/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Edit } from '@carbon/icons-react';
import React from 'react';

import { CarbonInlineLoading, Typography } from '@instana/components';
import { ProductiveCard } from '@instana/ibm-products';

import ScopeOverview from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/scope/ScopeOverview';
import ScopeDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/scope/ScopeDialog';
import { FORM_MODE } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { ApiTeam as Team } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import config from 'in-services/config';
import { t } from 'in-i18n';

interface TeamScopeCardProps {
  team: Team;
  isLoading: boolean;
}

const TeamScopeCard = ({ isLoading, team }: TeamScopeCardProps) => {
  return (
    <ProductiveCard
      actionIcons={[
        {
          icon: Edit,
          iconDescription: t('in-settings:tabs.teams.edit'),
          id: '1',
          onClick: () => {
            addActiveDialog(<ScopeDialog mode={FORM_MODE.NEW} />);
          }
        }
      ]}
      title={t('in-settings:tabs.teams.teamScope')}
    >
      {isLoading && <CarbonInlineLoading />}
      {!isLoading && !team?.scope && (
        <>
          <Typography variant="heading-03">
            {config.tenantUnit}-{config.tenant}
          </Typography>
          <Typography variant="body-01">{t('in-settings:tabs.teams.teamScopeNotDefinedMessage')}</Typography>
        </>
      )}
      {!isLoading && team?.scope && <ScopeOverview team={team} />}
    </ProductiveCard>
  );
};

export default TeamScopeCard;
