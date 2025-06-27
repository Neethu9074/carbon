/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

import { isEmpty, isNull, isUndefined } from 'lodash';
import React, { FC, useContext } from 'react';

import { Typography } from '@instana/components';

import { useRootCauseTopologyDataContext } from 'in-events/components/RootCauseAnalysis/Topology/context/RootCauseTopologyDataContext';
import { useEntitySelection } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import { RCAEntityDataType } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAppropriateRCAEntityData';
import EntityLink from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/EntityLink';
import { isServiceLabelValidToDisplayInRCA } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import { useIncident } from 'in-events/components/providers/IncidentProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EVENT_RCA_ENTITY_CLICK } from 'in-services/tracking/eventNames';
import { ServiceLabel } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/EntityPath.mless';

interface entityPathType {
  label: string;
  tracking: any;
  type: string;
  entityId: string; // Make optional to handle undefined cases
  additionalServices?: ServiceLabel[];
  plugin?: string;
}

const shouldShowRootCauseService = (rootCause: RCAEntityDataType) => {
  if (!rootCause) return false;

  const isInfra = rootCause?.entityType === 'infrastructure' || rootCause?.entityType === 'process';

  if (isInfra) {
    const { infraServiceLabelInformation } = rootCause;
    return (
      !isNull(infraServiceLabelInformation) &&
      !isUndefined(infraServiceLabelInformation) &&
      isServiceLabelValidToDisplayInRCA(infraServiceLabelInformation?.[0].id)
    );
  } else {
    const { nonInfraServiceLabelInformation } = rootCause;
    return (
      !isNull(nonInfraServiceLabelInformation) &&
      !isUndefined(nonInfraServiceLabelInformation) &&
      isServiceLabelValidToDisplayInRCA(nonInfraServiceLabelInformation?.label)
    );
  }
};

const getRootCauseService = (rootCause: RCAEntityDataType) => {
  if (!rootCause) return null;

  const isInfra = rootCause.entityType === 'infrastructure' || rootCause.entityType === 'process';
  if (isInfra) {
    return rootCause.infraServiceLabelInformation?.[0];
  } else {
    return rootCause.nonInfraServiceLabelInformation;
  }
};

const getPathsForInfra = (
  rootCause: RCAEntityDataType,
  entityPath: entityPathType[],
  rcaTrackingData: {}
): entityPathType[] => {
  const isInfra = rootCause.entityType === 'infrastructure' || rootCause.entityType === 'process';
  if (!isInfra) {
    return entityPath;
  }

  rootCause.hierarchySnapshots
    ?.filter(v => ['host', 'kubernetesPod', 'containerd'].includes(v.plugin as string))
    .forEach(snapshot => {
      entityPath.push({
        entityId: snapshot?.id as string,
        label: snapshot.label as string,
        tracking: {
          ...rcaTrackingData,
          ctaEvent: EVENT_RCA_ENTITY_CLICK,
          payload: {
            mainEntity: false,
            entityType: 'application'
          }
        },
        type: 'infrastructure',
        plugin: snapshot.plugin
      });
    });

  return entityPath;
};

const EntityPath: FC = () => {
  const { location } = useNavigation();
  const { selectedEntityId } = useEntitySelection();
  const { rootCauses, rootCauseMetadata } = useContext(RootCauseDataContext);
  const { incident } = useIncident();
  const { relatedAPInfo } = useRootCauseTopologyDataContext();
  const rootCauseIndex = rootCauses.findIndex(rc => rc.entityData?.id === selectedEntityId);
  const rootCause = rootCauses[rootCauseIndex];

  const showRootCauseService = shouldShowRootCauseService(rootCause);
  const rootCauseService = getRootCauseService(rootCause);

  const rcaTrackingData = {
    event: incident,
    location,
    rootCauseTab: rootCauseIndex,
    rcaEntityType: rootCause?.entityType || 'unknown',
    probabilityScore: rootCauseMetadata[rootCauseIndex]?.probFailure
  };

  if (!rootCause) return null;

  let entityPath: entityPathType[] = [];

  entityPath.push({
    label: rootCause.entityData?.label || '',
    tracking: {
      ...rcaTrackingData,
      ctaEvent: EVENT_RCA_ENTITY_CLICK,
      payload: {
        mainEntity: true,
        entityType: rootCause.entityType
      }
    },
    type: rootCause.entityType,
    entityId: rootCause.entityData?.id as string,
    plugin: translateFullyQualifiedPluginToShortPluginName(
      rootCauseMetadata[rootCauseIndex].entityID.pluginId
    ) as string
  });

  // add infra related content
  entityPath = getPathsForInfra(rootCause, entityPath, rcaTrackingData);

  if (showRootCauseService) {
    entityPath.push({
      label: rootCauseService?.label || '',
      tracking: {
        ...rcaTrackingData,
        ctaEvent: EVENT_RCA_ENTITY_CLICK,
        payload: {
          mainEntity: false,
          entityType: 'service'
        }
      },
      type: 'service',
      entityId: rootCauseService?.id as string,
      additionalServices: rootCause.infraServiceLabelInformation || []
    });
  }

  if (!isEmpty(relatedAPInfo?.id) && !isEmpty(relatedAPInfo?.label)) {
    entityPath.push({
      label: relatedAPInfo?.label || '',
      tracking: {
        ...rcaTrackingData,
        ctaEvent: EVENT_RCA_ENTITY_CLICK,
        payload: {
          mainEntity: false,
          entityType: 'application'
        }
      },
      type: 'application',
      entityId: relatedAPInfo?.id as string
    });
  }

  return (
    <div className={locals.entityPathContainer}>
      {/* For entity at fault */}
      <Typography variant="body-bold">{t('in-events:RCA.entityAtFault')}</Typography>
      {entityPath.map((item, i) => (
        <EntityLink
          key={i}
          index={i}
          label={item.label}
          tracking={item.tracking}
          type={item.type}
          entityId={item.entityId}
          isLast={i === entityPath.length - 1}
          additionalServices={item.additionalServices}
          plugin={item.plugin}
        />
      ))}
    </div>
  );
};

export default EntityPath;
