/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { ActionInstanceParameter } from '@instana/types';
import { Typography } from '@instana/components';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import FourLineWrapper from 'in-automation/components/FourLineWrapper/FourLineWrapper';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from './ActionInstanceDetail.mless';

function getRowProps() {
  return {
    className: locals.row,
    size: 'compact' as const
  };
}

export default function DetailParamsTab({ inputParameters }: { inputParameters: ActionInstanceParameter[] }) {
  const result = {
    // Parent component would only render if 'result has no errors' or 'result not loading'. Passing loading and errors param accordingly.
    progress: {
      loading: false
    },
    errors: [],
    data: {
      items: inputParameters ?? [],
      page: 1,
      pageSize: 10,
      totalHits: 0
    }
  };

  const columnDefinitions = [
    {
      id: 'displayName',
      sortable: false,
      label: t('in-automation:actionHistory.displayName'),
      getContent(item: ActionInstanceParameter) {
        return (
          <Tooltip content={item.displayName} align="topLeft" delay={500}>
            <span className={classNames(locals.ellipsis, locals.block)}>{item.displayName}</span>
          </Tooltip>
        );
      }
    },
    {
      id: 'name',
      sortable: false,
      label: t('in-automation:actionHistory.name'),
      getContent(item: ActionInstanceParameter) {
        return (
          <Tooltip content={item.name} align="topLeft" delay={500}>
            <span className={classNames(locals.ellipsis, locals.block)}>{item.name}</span>
          </Tooltip>
        );
      }
    },
    {
      id: 'value',
      sortable: false,
      label: 'Value',
      getContent(item: ActionInstanceParameter) {
        return (
          <FourLineWrapper>
            <Typography variant="body-regular">{item.value}</Typography>
          </FourLineWrapper>
        );
      }
    },
    {
      id: 'type',
      sortable: false,
      width: '8',
      label: t('in-automation:actionHistory.type'),
      getContent(item: ActionInstanceParameter) {
        if (item.type === 'vault') {
          return t('in-automation:vault');
        } else if (item.type === 'static') {
          return t('in-automation:static');
        } else if (item.type === 'dynamic') {
          return t('in-automation:dynamic');
        }
        return null;
      }
    }
  ];

  return (
    <div className={locals.instanceTabContent}>
      <ServerTablePresenter
        columnDefinitions={columnDefinitions}
        noDataMessage={t('in-automation:actionHistory.noParams')}
        getRowProps={getRowProps}
        result={result}
        page={0}
        orderBy="id"
        orderDirection="ASC"
        pageSize={result.data.pageSize}
        isSearchable={false}
      />
    </div>
  );
}
