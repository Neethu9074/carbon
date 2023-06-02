/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Application, SloEntityType, Website } from '@instana/types';
import { Card, Li, Stack, Ul } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  sloApplicationIdKey,
  sloEntityKey,
  sloEntityTypeKey,
  SloForm,
  sloWebsiteIdKey,
  isApplicationSloForm
} from 'in-service-levels/components/ConfigDialog/form';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import SearchInput from 'in-components/SearchInput/SearchInput';

export interface EntityData {
  id: string;
  label: string;
}

interface SloEntityTableProps {
  entityList?: Application[] | Website[];
  form: SloForm<SloEntityType>;
  onChange: (entityData: EntityData) => void;
}

export default function SloEntityTable({ form, entityList, onChange }: SloEntityTableProps) {
  const [query, setQuery] = useState('');

  const entity = form.get(sloEntityTypeKey).value;

  const result = isApplicationSloForm(form)
    ? form.getIn([sloEntityKey, sloApplicationIdKey]).value
    : form.getIn([sloEntityKey, sloWebsiteIdKey]).value;

  const dataPerRow = 6;
  const [next, setNext] = useState(dataPerRow);
  const loadMoreData = () => {
    setNext(next + dataPerRow);
  };

  return (
    <>
      <Card
        title={
          t('in-service-levels:general.select') + t('in-service-levels:general.entityTypes.label', { context: entity })
        }
        rightHeaderContent={<SearchInput query={query} onChange={q => setQuery(q)} />}
      >
        {entityList != undefined && entityList != null ? (
          <Ul>
            {entityList
              .filter(({ label }) => label.includes(query))
              ?.slice(0, next)
              .map(entityData => {
                return (
                  <Li onClick={() => onChange(entityData)} key={entityData.id}>
                    <Stack direction="horizontal">
                      <CheckboxFancy asRadioButton checked={entityData.id === result} onChange={() => {}} />
                      <div style={{ marginTop: '3px' }}>{entityData.label}</div>
                    </Stack>
                  </Li>
                );
              })}

            <Li onClick={loadMoreData}>
              <div style={{ marginLeft: '361px', color: '#00cccc' }}>{t('in-service-levels:general.loadMore')}</div>
            </Li>
          </Ul>
        ) : (
          <NoDataAvailable type="lib_actions_loading" height={160} text={t('in-service-levels:general.loadingData')} />
        )}
      </Card>
    </>
  );
}
