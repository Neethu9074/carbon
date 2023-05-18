/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import {
  CommonSloForm,
  isApplicationSloForm,
  isWebsiteSloForm,
  sloEntityTypeKey,
  SloForm
} from 'in-service-levels/components/ConfigDialog/form';
import { Application, SloEntityType, Website } from '@instana/types';
import { Item } from 'formalistic';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { getApplicationConfigsAsResult } from 'in-api/applicationConfigs';
import { getWebsiteConfigurations } from 'in-websites/api/websites';
import { deepCopy } from 'in-services/util/object';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { compareIgnoreCase } from 'in-services/util/string';
import SloEntityTable from 'in-service-levels/components/SloList/components/SloEntityTable';

interface SloScopeSectionProps {
  form: SloForm<SloEntityType>;
  onChange: (path: string[], updater: (i: Item) => Item) => void;
}

export const SloSelectionSection = ({ form, onChange }: SloScopeSectionProps): JSX.Element => {
  // const [monitoringSource = useState((form as unknown as CommonSloForm).get(sloEntityTypeKey));
  const sloEntityTypeField = (form as unknown as CommonSloForm).get(sloEntityTypeKey);
  console.log('monitoringSource', sloEntityTypeField.value);
  // const [entityList] = useEntityConfigurations(sloEntityTypeField);
  if (isApplicationSloForm(form)) {
    console.log('application');
    return (
      <>
        <SloEntityTable value={form.get(sloEntityTypeKey).value} onChange={() => null} />
      </>
    );
  } else if (isWebsiteSloForm(form)) {
    console.log('website');
    return (
      <>
        <SloEntityTable value={form.get(sloEntityTypeKey).value} onChange={() => null} />
      </>
    );
  }
  return <div></div>;
};
export const useEntityConfigurations = (
  monitoringSource?: Field<SloEntityType>
): FetchedState<Website[] | Application[]> => {
  const result = useObservable(() => {
    console.log('=========>', monitoringSource);
    console.log('table', monitoringSource.value);
    if (!monitoringSource.value) return just(pendingResult);
    console.log('b4 ternery operator', monitoringSource.value);
    let getEntityConfiguration;
    if (monitoringSource.value == 'website') {
      getEntityConfiguration = getApplicationConfigsAsResult;
      console.log('APPPPPPP');
    } else {
      console.log('WEBB');
      getEntityConfiguration = getWebsiteConfigurations;
    }
    // const getEntityConfiguration =
    //   monitoringSource.value == 'application' ? getApplicationConfigsAsResult : getWebsiteConfigurations;
    console.log('getEntityConfiguration', getEntityConfiguration);
    const result = getEntityConfiguration().map(({ data, ...rest }: any) => {
      const newData = data ? deepCopy(data) : [];
      console.log('newData', newData);
      const normalizedData = newData.map(({ id, ...config }: any) => {
        const label = 'label' in config ? config.label : config.name;
        return { id, label };
      });
      const sortedData = normalizedData.sort((a: { label: string }, b: { label: string }) =>
        compareIgnoreCase(a.label, b.label)
      );
      return {
        data: sortedData,
        ...rest
      };
    });
  }, [getApplicationConfigsAsResult, getWebsiteConfigurations]);
  console.log('resultToFetchedStateResponse(result)', resultToFetchedStateResponse(result));
  return resultToFetchedStateResponse(result);
};
