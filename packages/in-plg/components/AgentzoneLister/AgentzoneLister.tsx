/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { Stack, SvgIcon } from '@instana/components';

import CreatableComboBox from 'in-components/ComboBox/CreatableComboBox';
import { Option, Options } from 'in-components/ComboBox/ComboBox';
import HelpText from 'in-components/form/HelpText/HelpText';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { Trans, t } from 'in-i18n';

import locals from './AgentzoneLister.mless';

interface AgentzoneListerProp {
  callBackFunc: (agentZone: string) => void;
}

const AgentzoneLister = ({ callBackFunc }: AgentzoneListerProp) => {
  const [agentZoneInternal, setAgentZoneInternal] = useState<string>('');

  const listOfAgentZones: Options | Option = [
    { value: 'foo', label: 'foo' },
    { value: 'bar', label: 'bar' },
    { value: 'baz', label: 'baz' }
  ];

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
        value={agentZoneInternal}
        options={listOfAgentZones}
        onChange={(e: Option | null) => (e ? setAgentZoneInternal(e.value) : setAgentZoneInternal(''))}
        placeholder="e.g. Europe"
        formatCreateLabel={(inputText: string) => `Add "${inputText}"`}
      />
    </Stack>
  );
};

export default AgentzoneLister;
