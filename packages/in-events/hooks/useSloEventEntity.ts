/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  AlertingApplicationBoundaryScope,
  ServiceLevelObjectiveConfiguration,
  isApplicationSloEntity
} from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import useSloConfiguration from 'in-service-levels/hooks/useSloConfiguration';
import { Nullish } from 'in-types';

interface UseSloEventEntityProps {
  sloConfig: ServiceLevelObjectiveConfiguration;
  entityType: string;
  entityId: string;
  entityLabel: string;
  boundaryScope?: AlertingApplicationBoundaryScope;
}

export default function useSloEventEntity(event: any | Nullish): UseSloEventEntityProps | undefined {
  const sloId = event?.getIn(['metadata', 'sloId']);
  const [sloConfig] = useSloConfiguration(sloId);
  const entityType = event.get('plugin');
  const entityLabel = event.getIn(['metadata', 'entityLabel'], '');
  const isApplicationEntity = sloConfig?.entity && isApplicationSloEntity(sloConfig.entity);
  const boundaryScope = isApplicationEntity ? sloConfig.entity.boundaryScope : undefined;
  const sloConfigEntityId = isApplicationEntity ? sloConfig.entity.applicationId : sloConfig?.entity.websiteId;

  return (
    useObservable(() => {
      const entityId: string | undefined = event?.get('entityId') ?? sloConfigEntityId;

      if (!event || !sloConfig || !entityId) return just(undefined);

      return just({
        sloConfig,
        entityType,
        entityId,
        entityLabel,
        boundaryScope
      });
    }, [generateStableHash(event), generateStableHash(sloConfig)]) ?? undefined
  );
}
