/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Application, Progress, SloEntityType, Website } from '@instana/types';
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
import TableSkeleton from 'in-service-levels/components/SloList/components/TableSkeleton';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import SearchInput from 'in-components/SearchInput/SearchInput';
import { noop } from 'in-services/fixedObjects';

import locals from 'in-service-levels/components/SloList/components/SloEntityTable.mless';

export interface EntityData {
  id: string;
  label: string;
}

interface SloEntityTableProps {
  entityList?: Application[] | Website[];
  form: SloForm<SloEntityType>;
  progress: Progress;
  onChange: (entityData: EntityData) => void;
}

const dataPerRow = 6;
export default function SloEntityTable({ form, entityList, onChange, progress }: SloEntityTableProps) {
  const [query, setQuery] = useState('');
  const [next, setNext] = useState(dataPerRow);
  const entity = form.get(sloEntityTypeKey).value;

  const entityId = isApplicationSloForm(form)
    ? form.getIn([sloEntityKey, sloApplicationIdKey]).value
    : form.getIn([sloEntityKey, sloWebsiteIdKey]).value;

  const loadMoreData = () => {
    setNext(next + dataPerRow);
  };
  if (progress.loading) return <TableSkeleton />;
  return (
    <Card
      title={
        t('in-service-levels:general.select') + t('in-service-levels:general.entityTypes.label', { context: entity })
      }
      rightHeaderContent={<SearchInput query={query} onChange={q => setQuery(q)} />}
    >
      {entityList?.length === 0 ||
        (entityList === undefined && <NoDataAvailable height={160} text={t('in-service-levels:general.noData')} />)}
      {entityList && (
        <Ul>
          {entityList
            .filter(({ label }) => label.includes(query))
            .slice(0, next)
            .map(entityData => {
              return (
                <Li onClick={() => onChange(entityData)} key={entityData.id}>
                  <Stack direction="horizontal">
                    <CheckboxFancy asRadioButton checked={entityData.id === entityId} onChange={noop} />
                    <div className={locals.checkBoxItem}>{entityData.label}</div>
                  </Stack>
                </Li>
              );
            })}

          <Li onClick={loadMoreData}>
            <div className={locals.loadMore}>{t('in-service-levels:general.loadMore')}</div>
          </Li>
        </Ul>
      )}
    </Card>
  );
}
