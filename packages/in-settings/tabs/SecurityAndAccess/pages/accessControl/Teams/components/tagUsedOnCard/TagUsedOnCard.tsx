/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ArrowRight } from '@carbon/icons-react';
import React from 'react';

import { ClickableTile, InlineLoading, Layer } from '@instana/carbon';
import { TeamDetailsTeamEntityDetails } from '@instana/types';
import { Typography, Spacer } from '@instana/components';
import { ProductiveCard } from '@instana/ibm-products';

import { TEAMTAG_USED_ENTITIES } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/tagUsedOnCard/TagUsedOnCard.constants';
import NoTagUsedOn from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/tagUsedOnCard/NoTagUsedOn';
import { TEAMS_ENTITY_LINKS } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/Teams.constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

import locals from './TagUsedOnCard.mless';

interface TagUsedOnCardProps {
  isLoading: boolean;
  entities?: TeamDetailsTeamEntityDetails[];
  teamName?: string;
}

const TagUsedOnCard = ({ isLoading, entities, teamName }: TagUsedOnCardProps) => {
  const { createHrefToPath } = useNavigation();
  const isEmptyTagInUse = entities ? Object.values(entities).every(entity => entity.ids?.length === 0) : true;

  return (
    <ProductiveCard title={t('in-settings:tabs.teams.teamAssociations')} className={locals.tagUsedOnCard}>
      {isLoading && <InlineLoading />}
      {!isLoading && isEmptyTagInUse && <NoTagUsedOn />}
      {!isLoading && !isEmptyTagInUse && (
        <div className={locals.tagTileContainer}>
          {TEAMTAG_USED_ENTITIES.map(teamTagUsedEntity => {
            const { id, title } = teamTagUsedEntity;
            const entityCount = entities?.find(entity => entity.name === id)?.ids?.length ?? 0;
            const entityLinkInfo = TEAMS_ENTITY_LINKS[id];
            let navLink = entityLinkInfo?.link;
            if (navLink) {
              navLink = navLink + ';' + entityLinkInfo?.paramName + '=:' + entityLinkInfo?.scope + ':' + teamName + '!';
              navLink = createHrefToPath(navLink);
            }
            return (
              entityCount > 0 && (
                <Layer key={id}>
                  <ClickableTile
                    title={title}
                    renderIcon={ArrowRight}
                    id={id}
                    className={locals.tagTile}
                    href={navLink}
                  >
                    <Typography variant="body-01" component="p">
                      {title}
                    </Typography>
                    <Typography variant="heading-03">{entityCount > 99 ? '+99' : entityCount}</Typography>
                    <Spacer vertical="small" />
                  </ClickableTile>
                </Layer>
              )
            );
          })}
        </div>
      )}
    </ProductiveCard>
  );
};

export default TagUsedOnCard;
