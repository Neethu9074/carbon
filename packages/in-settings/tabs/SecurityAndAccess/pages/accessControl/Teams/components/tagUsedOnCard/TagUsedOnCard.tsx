/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ArrowRight } from '@carbon/icons-react';
import React from 'react';

import { CarbonClickableTile, CarbonInlineLoading, Typography, Spacer, CarbonLayer } from '@instana/components';
import { ProductiveCard } from '@instana/ibm-products';

import { TEAMTAG_USED_ENTITIES } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/tagUsedOnCard/TagUsedOnCard.constants';
import NoTagUsedOn from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/tagUsedOnCard/NoTagUsedOn';
import { TeamTagUsed } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { t } from 'in-i18n';

import locals from './TagUsedOnCard.mless';

interface TagUsedOnCardProps {
  isLoading: boolean;
  teamTagUsed: TeamTagUsed;
}

const TagUsedOnCard = ({ isLoading, teamTagUsed }: TagUsedOnCardProps) => {
  const isEmptyTagInUse = teamTagUsed ? Object.values(teamTagUsed).every(value => value === 0) : true;

  return (
    <ProductiveCard title={t('in-settings:tabs.teams.teamTagUsedOn')} className={locals.teamTagUsageContainer}>
      {isLoading && <CarbonInlineLoading />}
      {!isLoading && isEmptyTagInUse && <NoTagUsedOn />}
      {!isLoading && !isEmptyTagInUse && (
        <div className={locals.entityTile}>
          {TEAMTAG_USED_ENTITIES.map((teamTagUsedEntity, index) => {
            const { title, id } = teamTagUsedEntity;
            return (
              <CarbonLayer>
                <CarbonClickableTile title={title} renderIcon={ArrowRight} key={index} id={id}>
                  <Typography variant="body-01" component="p">
                    {title}
                  </Typography>
                  <Typography variant="heading-03">{teamTagUsed[id] > 99 ? '+99' : teamTagUsed[id]}</Typography>
                  <Spacer vertical="small" />
                </CarbonClickableTile>
              </CarbonLayer>
            );
          })}
        </div>
      )}
    </ProductiveCard>
  );
};

export default TagUsedOnCard;
