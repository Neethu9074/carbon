/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Li, Stack, SvgIcon, Typography } from '@instana/components';
import { GroupPermissionEntity } from '@instana/types';

import { SubsectionHeader } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/SubsectionHeader/SubsectionHeader';
import { compareIgnoreCase } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

/**
 * Kind of Kubernetes entities to be displayed
 */
export enum EntityType {
  Cluster,
  Namespace
}

/**
 * Proprerties for this component
 */
interface Props {
  availableEntities: GroupPermissionEntity[] | undefined;
  headerText: string;
  accessableEntities: string[];
}

interface Entity extends GroupPermissionEntity {
  obsolete: boolean;
}

/**
 * Creates an instance of the component
 * @param param0 see props
 * @returns new instance
 */
export const KubernetesEntityList = ({ availableEntities, headerText, accessableEntities }: Props) => {
  const existingEntitiesWithAccess = availableEntities
    ?.filter(entity => accessableEntities.includes(entity.id))
    .map(({ id, name }) => ({ id, name, obsolete: false }));

  if (!existingEntitiesWithAccess) return null;
  const displayEntities = existingEntitiesWithAccess;
  if (existingEntitiesWithAccess?.length !== accessableEntities.length) {
    const obsolete: Entity[] = accessableEntities
      .filter(id => !id || !existingEntitiesWithAccess?.some(it => it.id === id))
      .map(id => ({ id, name: id, obsolete: true }));
    displayEntities.push(...obsolete);
    displayEntities.sort((a, b) => compareIgnoreCase(a.name, b.name));
  }
  return (
    <>
      <SubsectionHeader headerText={headerText} />
      {displayEntities.map(entity => (
        <Li noAlternatingBg key={entity.id}>
          <Stack gap="xsmall" direction="horizontal" align="start">
            <Typography variant="body-regular" component="span">
              {entity.name}
            </Typography>
            {entity.obsolete && (
              <Tooltip content={t('in-settings:productAreas.obsoleteEntityDescription')} align="leftMiddle" delay={500}>
                <SvgIcon type="lib_help_error_info_outline" size="s" color={'#172429'} />
              </Tooltip>
            )}
          </Stack>
        </Li>
      ))}
    </>
  );
};
