/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Application, SloEntityType, Website } from '@instana/types';
import { Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import SloEntityTypeSelector from 'in-service-levels/components/SloList/components/SloEntityTypeSelector';
import SloEntityTable from 'in-service-levels/components/SloList/components/SloEntityTable';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getApplicationConfigsAsResult } from 'in-api/applicationConfigs';
import { getWebsiteConfigurations } from 'in-websites/api/websites';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { deepCopy } from 'in-services/util/object';
import { t } from 'in-i18n';

const entityType = 'application';
export default function SelectEntity() {
  const [monitoringSource, setMonitoringSource] = useState<SloEntityType>();
  const [selectedEntity, setSelectedEntity] = useState<Application | Website>();
  const [entityList] = useEntityConfigurations(monitoringSource);
  const selectedLabel = selectedEntity ? selectedEntity.label : t('in-service-levels:general.noSelection');
  return (
    <>
      <Typography variant="heading-200" component="h2">
        {t('in-service-levels:createSloDialog.selectEntityTitle')}
      </Typography>
      <SloEntityTypeSelector
        value={entityType}
        onChange={e => {
          setSelectedEntity(undefined);
          setMonitoringSource(e);
        }}
      />
      <Typography variant="heading-100" component="h3">
        {t('in-service-levels:general.selectLabel', { selectedLabel })}
      </Typography>
      {monitoringSource && (
        <SloEntityTable value={selectedEntity} onChange={setSelectedEntity} entityList={entityList} />
      )}
    </>
  );
}

export const useEntityConfigurations = (monitoringSource?: SloEntityType): FetchedState<Website[] | Application[]> => {
  const result = useObservable(() => {
    if (!monitoringSource) return just(pendingResult);

    const getEntityConfiguration =
      monitoringSource === 'application' ? getApplicationConfigsAsResult : getWebsiteConfigurations;
    return getEntityConfiguration().map(({ data, ...rest }) => {
      const newData = data ? deepCopy(data) : [];
      const normalizedData = newData.map(({ id, ...config }) => {
        const label = 'label' in config ? config.label : config.name;
        return { id, label };
      });
      const sortedData = normalizedData.sort((a, b) => compareIgnoreCase(a.label, b.label));
      return {
        data: sortedData,
        ...rest
      };
    });
  }, [getApplicationConfigsAsResult, getWebsiteConfigurations]);
  return resultToFetchedStateResponse(result);
};
