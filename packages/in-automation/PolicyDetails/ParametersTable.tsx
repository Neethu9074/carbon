/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonStack, Typography } from '@instana/components';
import { Parameter } from '@instana/types';

import { toViewModel } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import DynamicTagBasedPayloadConfigurator from 'in-automation/components/DynamicTagBasedPayloadConfigurator';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { DynamicFieldValue } from 'in-types';
import { t } from 'in-i18n';

const safeJsonParse = (raw: string) => {
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
};

const columnDefinitions = [
  {
    id: 'displayName',
    sortable: true,
    label: t('in-automation:ActionCatalog.displayName'),
    getContent(item: Parameter) {
      return (
        <Tooltip content={item.label} align="topLeft" delay={500}>
          {/* className={classNames(locals.ellipsis, locals.block)}÷ */}
          <span>{item.label}</span>
        </Tooltip>
      );
    }
  },
  {
    id: 'name',
    sortable: true,
    label: t('in-automation:name'),
    getContent(item: Parameter) {
      return (
        <Tooltip content={item.name} align="topLeft" delay={500}>
          <Typography noWrap variant="body-regular">
            {item.name}
          </Typography>
        </Tooltip>
      );
    }
  },
  {
    id: 'value',
    sortable: true,
    label: t('in-automation:value'),
    getContent(item: Parameter) {
      return <>{getGetParameterValue(item)}</>;
    }
  },
  {
    id: 'type',
    sortable: true,
    width: '16',
    label: t('in-automation:type'),
    getContent(item: Parameter) {
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

function getRowProps() {
  return {
    size: 'compact' as const
  };
}
export default function ParametersTable({ inputParameters }: { inputParameters?: Parameter[] }) {
  const result = {
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

  return (
    <>
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
    </>
  );
}

function getGetParameterValue(parameter: Parameter) {
  if (parameter.type === 'vault') {
    const parsedDynamicValue = safeJsonParse(parameter.value ?? '{}');
    return (
      <>
        <CarbonStack orientation="vertical" gap={1}>
          <div>
            {t('in-automation:secretKey')}: {parsedDynamicValue.secretKey}
          </div>
          <div>
            {t('in-automation:secretPath')}: {parsedDynamicValue.secretPath}
          </div>
        </CarbonStack>
      </>
    );
  } else if (parameter.type === 'dynamic') {
    const parsedDynamicValue: DynamicFieldValue = safeJsonParse(parameter.value ?? '{}');
    return <DynamicTagBasedPayloadConfigurator value={toViewModel(parsedDynamicValue)} disabled />;
  }
  return parameter.value;
}
