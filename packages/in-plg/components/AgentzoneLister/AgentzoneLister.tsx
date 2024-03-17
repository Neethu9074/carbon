/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { Stack, SvgIcon } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import getEntities from 'in-plg/subscriptions/getInfrastructureEntities';
import CreatableComboBox from 'in-components/ComboBox/CreatableComboBox';
import { Option, Options } from 'in-components/ComboBox/ComboBox';
import HelpText from 'in-components/form/HelpText/HelpText';
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

const AgentzoneLister = ({ callBackFunc }: AgentzoneListerProp) => {
  const [isLoading, setIsLoading] = useState(false);
  const [listOfAgentZones, setListOfAgentZones] = useState([]);
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
        retrievalSize: 200,
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
        <div className={locals.helpTextContentWrapper}>
          <Stack direction="horizontal" gap="xxsmall" align="center">
            <HelpText className={locals.helpText}>{t('in-plg:agentDetails.common.agentZoneOptional')}</HelpText>
            <SvgIcon size="xs" type="lib_help_error_help_outline" color="var(--ids-color-option-neutral-600)" />
          </Stack>
        </div>
      </Tooltip>
      <CreatableComboBox
        className={locals.comboBox}
        isLoading={isLoading}
        options={listOfAgentZones}
        onChange={(e: Option | Options | null) =>
          e ? setAgentZoneInternal((e as Option).value) : setAgentZoneInternal('')
        }
        onBlur={() => setBackendQueryModel(backendQueryModelDefaultValue)}
        placeholder="e.g. Europe"
        formatCreateLabel={(inputText: string) => `Add "${inputText}"`}
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
