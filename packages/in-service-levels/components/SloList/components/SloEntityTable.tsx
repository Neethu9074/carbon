/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Application, Progress, SloEntityType, Website } from '@instana/types';
import { Li, Stack, Ul } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  sloApplicationIdKey,
  sloEntityKey,
  SloForm,
  sloWebsiteIdKey,
  isApplicationSloForm
} from 'in-service-levels/components/ConfigDialog/form';
import TableSkeleton from 'in-service-levels/components/SloList/components/TableSkeleton';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
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
  query: string;
  onChange: (entityData: EntityData) => void;
}

const dataPerRow = 6;
export default function SloEntityTable({ form, entityList, onChange, progress, query }: SloEntityTableProps) {
  const [next, setNext] = useState(dataPerRow);

  const entityId = isApplicationSloForm(form)
    ? form.getIn([sloEntityKey, sloApplicationIdKey]).value
    : form.getIn([sloEntityKey, sloWebsiteIdKey]).value;

  const isDataAvailable = entityList !== undefined && entityList.length > 0;
  const loadMoreData = () => {
    setNext(next + dataPerRow);
  };
  if (progress.loading) return <TableSkeleton />;
  if (!isDataAvailable) return <NoDataAvailable height={160} text={t('in-service-levels:general.noData')} />;

  return (
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

      <Li onClick={loadMoreData} className={locals.loadMore}>
        {t('in-service-levels:general.loadMore')}
      </Li>
    </Ul>
  );
}
