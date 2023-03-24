/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Li, Typography } from '@instana/components';

import { SubsectionHeader } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/components/SubsectionHeader/SubsectionHeader';
import { getKubernetesData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getKubernetesData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
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
  type: EntityType;
  headerText: string;
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
export const KubernetesEntityList = ({ availableEntities, headerText, type }: Props) => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { kubernetesNamespacesWithAccess, kubernetesClustersWithAccess } = getKubernetesData(permissionsSet);

  const allEntityAccessIds =
    type === EntityType.Cluster ? kubernetesClustersWithAccess : kubernetesNamespacesWithAccess;
  const existingEntitiesWithAccess = availableEntities?.filter(entity => allEntityAccessIds.includes(entity.id));

  if (!existingEntitiesWithAccess) return null;
  const displayEntities = existingEntitiesWithAccess;
  if (existingEntitiesWithAccess?.length !== allEntityAccessIds.length) {
    const obsolete: GroupPermissionEntity[] = allEntityAccessIds
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
