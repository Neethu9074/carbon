/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Code, CarbonColumn, CarbonGrid, CarbonRow, CarbonStack, CarbonTile, Typography } from '@instana/components';
import { Action } from '@instana/types';

import { getInterpreterFromFields, getScriptFromFields } from 'in-automation/utils/actionField';
import KeyValueCard from 'in-automation/components/KeyValueCard/KeyValueCard';
import { ACTION_TRANSLATIONS, ACTION_TYPE } from 'in-automation/constants';
import { Nullish } from 'in-types';

import local from 'in-automation/ActionDashboard/ActionDashboard.mless';

interface ActionDetailsCardProps {
  data: Action | Nullish;
}

export default function ActionDetailsCard({ data }: ActionDetailsCardProps) {
  if (!data) return null;
  const { type, fields } = data;
  const script = getScriptFromFields(fields);
  const interpreter = getInterpreterFromFields(fields);
  let plaintextInterpreter = interpreter.value;
  let plaintextScript = script.value;
  if (script.encoding === 'base64') {
    plaintextScript = atob(plaintextScript);
  }
  if (interpreter.encoding === 'base64') {
    plaintextInterpreter = atob(plaintextInterpreter);
  }

  return (
    <CarbonTile className={local.borderBottom}>
      <CarbonStack orientation="horizontal" className={local.titleStack}>
        <Typography variant="heading-02">Action configuration</Typography>
      </CarbonStack>
      <CarbonRow>
        <CarbonGrid fullWidth className={local.noHorizontalPaddings}>
          <CarbonColumn sm={4}>
            <KeyValueCard label="Type" value={ACTION_TRANSLATIONS[type]} />
          </CarbonColumn>
          <CarbonColumn sm={4}>
            <KeyValueCard label="Interpreter" value={plaintextInterpreter} />
          </CarbonColumn>
          <CarbonColumn span="50%">
            <KeyValueCard label="Timeout" value={'1'} />
          </CarbonColumn>
          {type === ACTION_TYPE.SCRIPT && (
            <CarbonColumn span="100%">
              <KeyValueCard
                label="Script"
                value={
                  <Code
                    code={plaintextScript}
                    lang="bash"
                    withExpandButton
                    wrapperClassName="code-snippet-wrapper"
                    softWrap
                  />
                }
              />
            </CarbonColumn>
          )}
        </CarbonGrid>
      </CarbonRow>
    </CarbonTile>
  );
}
