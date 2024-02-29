/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';
import classNames from 'classnames';
import { noop } from 'lodash';

import { Application, Progress, Website } from '@instana/types';
import { Li, Stack, Ul } from '@instana/components';
import { t } from '@instana/i18n-react';

import SloEntityTableSkeleton from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTableSkeleton';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';

import locals from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTable.mless';

export const SloEntityTablePageSize = 6;

export interface EntityData {
  id: string;
  label: string;
}

interface SloEntityTableProps {
  disabled?: boolean;
  entityList?: Application[] | Website[];
  onChange: (entityData: EntityData) => void;
  progress: Progress;
  canLoadMore?: boolean;
  loadMore?: () => void;
  hasError?: boolean;
}

export default function SloEntityTable({
  canLoadMore,
  disabled = false,
  entityList,
  hasError,
  loadMore,
  onChange,
  progress
}: SloEntityTableProps) {
  const { form } = useContext(SloFormContext);

  const entityId = form.getIn(['entity', 'entityId']);

  if (progress.loading) return <SloEntityTableSkeleton />;

  const isDataAvailable = entityList !== undefined && entityList.length > 0;

  if (!isDataAvailable) return <NoDataAvailable height={160} text={t('in-service-levels:general.noData')} />;

  const shouldRenderMoreButton = canLoadMore && loadMore && !disabled;

  return (
    <Ul
      className={classNames({
        [locals.withError]: hasError
      })}
    >
      {entityList.map(entityData => {
        return (
          <Li
            className={classNames({
              [locals.disabled]: disabled
            })}
            onClick={disabled ? noop : () => onChange(entityData)}
            key={entityData.id}
          >
            <Stack direction="horizontal">
              <CheckboxFancy
                asRadioButton
                checked={entityData.id === entityId.value}
                disabled={disabled}
                onChange={disabled ? noop : () => onChange(entityData)}
              />
              <div className={locals.checkBoxItem}>{entityData.label}</div>
            </Stack>
          </Li>
        );
      })}

      {shouldRenderMoreButton && (
        <Li onClick={loadMore} className={locals.loadMore}>
          {t('in-service-levels:general.loadMore')}
        </Li>
      )}
    </Ul>
  );
}
