/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item } from 'formalistic';
import React from 'react';

import { Application, SloEntityType, Website } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  CommonSloForm,
  isApplicationSloForm,
  isWebsiteSloForm,
  sloApplicationIdKey,
  sloEntityKey,
  sloEntityTypeKey,
  SloForm,
  sloWebsiteIdKey
} from 'in-service-levels/components/ConfigDialog/form';
import SloEntityTable from 'in-service-levels/components/SloList/components/SloEntityTable';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getApplicationConfigsAsResult } from 'in-api/applicationConfigs';
import { getWebsiteConfigurations } from 'in-websites/api/websites';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { deepCopy } from 'in-services/util/object';

interface SloScopeSectionProps {
  form: SloForm<SloEntityType>;
  onChange: (path: string[], updater: (i: Item) => Item) => void;
}

export const SloSelectionSection = ({ form, onChange }: SloScopeSectionProps): JSX.Element => {
  const sloEntityTypeField = (form as unknown as CommonSloForm).get(sloEntityTypeKey);

  const [entityList] = useEntityConfigurations(sloEntityTypeField.value);
  if (isApplicationSloForm(form)) {
    return (
      <>
        <SloEntityTable
          form={form}
          entityList={entityList}
          onChange={id => {
            return onChange([sloEntityKey, sloApplicationIdKey], field =>
              (field as Field<any>).setValue(id).setTouched(true)
            );
          }}
        />
      </>
    );
  } else if (isWebsiteSloForm(form)) {
    return (
      <>
        <SloEntityTable
          form={form}
          entityList={entityList}
          onChange={id => {
            return onChange([sloEntityKey, sloWebsiteIdKey], field =>
              (field as Field<any>).setValue(id).setTouched(true)
            );
          }}
        />
      </>
    );
  }
  return <div />;
};

export const useEntityConfigurations = (monitoringSource?: SloEntityType): FetchedState<Website[] | Application[]> => {
  const getEntityConfiguration =
    monitoringSource == 'application' ? getApplicationConfigsAsResult : getWebsiteConfigurations;

  const result = useObservable(() => {
    if (!monitoringSource) return just(pendingResult);
    return getEntityConfiguration().map(({ data, ...rest }: any) => {
      const newData = data ? deepCopy(data) : [];
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
  }, [getEntityConfiguration]);
  return resultToFetchedStateResponse(result);
};
