/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Stack, SvgIcon } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import getEntities from 'in-plg/subscriptions/getInfrastructureEntities';
import CreatableComboBox from 'in-components/ComboBox/CreatableComboBox';
import { Option, Options } from 'in-components/ComboBox/ComboBox';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Trans, t } from 'in-i18n';

import locals from './AgentzoneLister.mless';

interface AgentzoneListerProp {
  callBackFunc: (agentZone: string) => void;
}

interface BackendQueryModelProp {
  type: string;
  logicalOperator?: string;
  elements?: never[];
  name?: string;
  operator?: 'EQUALS' | 'NOT_EQUAL' | 'CONTAINS' | 'NOT_CONTAIN' | 'NOT_EMPTY' | 'IS_EMPTY';
  entity?: 'NOT_APPLICABLE';
  value?: string;
}

interface GetAgentZonesProp {
  timeConfig: TimeConfig;
  backendQueryModel: BackendQueryModelProp;
}

const backendQueryModelDefaultValue = {
  type: 'EXPRESSION',
  logicalOperator: 'AND',
  elements: []
};

const retrievalSize = 200;

/**
 *
 * @param callBackFunc It send the state update back to the parent component.
 * @returns string[] of first 200 Agent zones sorted by the name.
 *
 * * Each search will send an API request to fetch the Agent zones based
 * * on search criteria. This ensures that if the searched keyword is not
 * * present in the first 200, the user can still get it from backend.
 *
 * ! Search functionality is case-sensitive.
 */
const AgentzoneLister = ({ callBackFunc }: AgentzoneListerProp) => {
  const [isLoading, setIsLoading] = useState(false);
  const [listOfAgentZones, setListOfAgentZones] = useState<string[]>([]);
  const [backendQueryModel, setBackendQueryModel] = useState<BackendQueryModelProp>(backendQueryModelDefaultValue);
  const [agentZoneInternal, setAgentZoneInternal] = useState<string>('');

  const timeConfig = useTimeConfig();

  function getAgentZones({ timeConfig, backendQueryModel }: GetAgentZonesProp) {
    return getEntities({
      filter: {
        tagFilterExpression: backendQueryModel,
        timeConfig
      },
      order: { by: 'label', direction: 'ASC' },
      pagination: {
        retrievalSize: retrievalSize,
        fullData: false
      },
      type: 'genericZone'
    });
  }

  interface AgentZonesItemsProp {
    label: string;
  }

  useObservable(
    getAgentZones({ timeConfig, backendQueryModel })
      .map(result => {
        if (result?.progress?.loading) {
          setIsLoading(true);
        } else {
          setIsLoading(false);
        }
        const items = result?.data?.items;
        if (items) {
          return items.map((item: AgentZonesItemsProp) => ({ value: item?.label, label: item?.label }));
        } else {
          return [];
        }
      })
      .tap(result => {
        setListOfAgentZones(result);
      }),
    [backendQueryModel]
  );

  useEffect(() => {
    if (agentZoneInternal) {
      callBackFunc(agentZoneInternal);
    } else {
      callBackFunc('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentZoneInternal]);

  return (
    <Stack gap="xsmall">
      <Tooltip
        content={
          <Trans
            i18nKey="in-plg:agentDetails.common.enterANameForAClusterGroupYouWantToAddThisClusterTo"
            components={{ br: <br /> }}
          />
        }
        align="auto"
      >
        <Stack direction="horizontal" align="end">
          <div className={classNames('cds--form__helper-text', { [locals.helpText]: true })}>
            {t('in-plg:agentDetails.common.agentZoneOptional')}
          </div>
          <SvgIcon size="xs" type="lib_help_error_help_outline" color="var(--ids-color-option-neutral-600)" />
        </Stack>
      </Tooltip>
      <CreatableComboBox
        className={locals.comboBox}
        isLoading={isLoading}
        options={listOfAgentZones}
        onChange={(e: Option | Options | null) =>
          e ? setAgentZoneInternal((e as Option).value) : setAgentZoneInternal('')
        }
        onBlur={() => setBackendQueryModel(backendQueryModelDefaultValue)}
        placeholder={t('in-plg:Components.AgentzoneLister.EGEurope')}
        formatCreateLabel={(inputText: string) => `${t('in-plg:Components.AgentzoneLister.Add')} "${inputText}"`}
        onInputChange={(inputValue: string) => {
          if (inputValue) {
            setBackendQueryModel({
              type: 'TAG_FILTER',
              name: 'label',
              operator: 'CONTAINS',
              entity: 'NOT_APPLICABLE',
              value: `${inputValue}`
            });
          } else {
            setBackendQueryModel(backendQueryModelDefaultValue);
          }
        }}
      />
    </Stack>
  );
};

export default AgentzoneLister;
