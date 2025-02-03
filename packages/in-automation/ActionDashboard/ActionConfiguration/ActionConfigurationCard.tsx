/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  CarbonColumn,
  CarbonFormGroup,
  CarbonGrid,
  CarbonRow,
  CarbonStack,
  CarbonTile,
  Code,
  Typography
} from '@instana/components';
import { Action } from '@instana/types';

import { getInterpreterFromFields, getScriptFromFields } from 'in-automation/utils/actionField';
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
            <CarbonFormGroup legendText="Type">{ACTION_TRANSLATIONS[type]}</CarbonFormGroup>
          </CarbonColumn>
          <CarbonColumn sm={4}>
            <CarbonFormGroup legendText="Interpreter">{plaintextInterpreter ?? '-'}</CarbonFormGroup>
          </CarbonColumn>
          <CarbonColumn span="50%">
            <CarbonFormGroup legendText="Timeout">-</CarbonFormGroup>
          </CarbonColumn>
          {type === ACTION_TYPE.SCRIPT && (
            <CarbonColumn span="100%">
              <CarbonFormGroup legendText="Script">
                <Code
                  code={plaintextScript}
                  lang="bash"
                  withExpandButton
                  wrapperClassName="code-snippet-wrapper"
                  softWrap
                />
              </CarbonFormGroup>
            </CarbonColumn>
          )}
        </CarbonGrid>
      </CarbonRow>
    </CarbonTile>
  );
}
