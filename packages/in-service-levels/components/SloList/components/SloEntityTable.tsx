/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card, Li, Stack, Ul } from '@instana/components';
import { Application, Website, SloEntityType } from '@instana/types';
import { t } from '@instana/i18n-react';

import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import SearchInput from 'in-components/SearchInput/SearchInput';
import { getWebsiteConfigurations } from 'in-websites/api/websites';
import { getApplicationConfigsAsResult } from 'in-api/applicationConfigs';
// import { pendingResult } from 'in-services/fixedObjects';
import { useObservable } from '@instana/hooks';
// import { just } from '@instana/observables';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { FetchedState } from 'in-hooks/utils/types';
import { deepCopy } from 'in-services/util/object';
import { compareIgnoreCase } from 'in-services/util/string';

interface SloEntityTableProps {
  // entityList?: Application[] | Website[];
  value?: SloEntityType | undefined;
  onChange: React.Dispatch<React.SetStateAction<Application | Website | undefined>>;
}

export default function SloEntityTable({ value, onChange }: SloEntityTableProps) {
  const [query, setQuery] = useState('');
  console.log('value', value);
  const [entityList] = useEntityConfigurations(value);
  // console.log('entityList', entityList);
  return (
    <>
      <Card
        title={'Select ' + t('in-service-levels:general.entityTypes.label', { context: value })}
        rightHeaderContent={<SearchInput query={query} onChange={q => setQuery(q)} />}
      >
        {entityList && (
          <Ul>
            {entityList
              .filter(({ label }) => label.includes(query))
              .map(({ label, id }) => {
                return (
                  <Li key={id}>
                    <Stack direction="horizontal">
                      <CheckboxFancy
                        asRadioButton
                        value={label}
                        onChange={() => {
                          onChange({ id, label });
                        }}
                        checked={id === value}
                      />
                      {label}
                    </Stack>
                  </Li>
                );
              })}
          </Ul>
        )}
      </Card>
    </>
  );
}

export const useEntityConfigurations = (monitoringSource?: SloEntityType): FetchedState<Website[] | Application[]> => {
  const result = useObservable(() => {
    // if (!monitoringSource) return just(pendingResult);
    console.log('monitoringSource', monitoringSource);
    let getEntityConfiguration;
    if (monitoringSource == 'website') {
      console.log(1);
      getEntityConfiguration = getApplicationConfigsAsResult;
    } else {
      console.log(2);
      getEntityConfiguration = getWebsiteConfigurations;
    }
    // const getEntityConfiguration =
    //   monitoringSource == 'application' ? getApplicationConfigsAsResult : getWebsiteConfigurations;
    return getEntityConfiguration().map(({ data, ...rest }: any) => {
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
  }, []);
  console.log('resultToFetchedStateResponse(result)', resultToFetchedStateResponse(result));
  return resultToFetchedStateResponse(result);
};
