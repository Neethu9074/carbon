/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Li, Typography } from '@instana/components';

import { SubsectionHeader } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/components/SubsectionHeader/SubsectionHeader';
import { GroupPermissionEntity } from 'in-kubernetes/subscriptions/groupPermissionEntities';
import { compareIgnoreCase } from 'in-services/util/string';
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

/**
 * creates a GroupPermissionEntity for the given id
 * @param id needs to be null, as compiler did not recognize the truthy check beforehand
 * @returns object with given id and a display name (id (obsolete))
 */
function createGroupPermissionEntityForObsoleteEntry(id?: string): GroupPermissionEntity {
  return { id: id!!, name: t('in-settings:productAreas.obsoleteEntity', { id }) };
}

/**
 * Creates an instance of the component
 * @param param0 see props
 * @returns new instance
 */
export const KubernetesEntityList = ({ availableEntities, headerText, accessableEntities }: Props) => {
  const existingEntitiesWithAccess = availableEntities?.filter(entity => accessableEntities.includes(entity.id));

  if (!existingEntitiesWithAccess) return null;
  const displayEntities = existingEntitiesWithAccess;
  if (existingEntitiesWithAccess?.length !== accessableEntities.length) {
    const obsolete: GroupPermissionEntity[] = accessableEntities
      .filter(id => !id || !existingEntitiesWithAccess?.some(it => it.id === id))
      .map(createGroupPermissionEntityForObsoleteEntry);
    displayEntities.push(...obsolete);
    displayEntities.sort((a, b) => compareIgnoreCase(a.name, b.name));
  }
  return (
    <>
      <SubsectionHeader headerText={headerText} />
      {displayEntities.map(entity => (
        <Li noAlternatingBg key={entity.id}>
          <Typography variant="body-regular">{entity.name}</Typography>
        </Li>
      ))}
    </>
  );
};
