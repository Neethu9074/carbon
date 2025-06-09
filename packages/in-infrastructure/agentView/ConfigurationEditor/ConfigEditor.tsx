/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import * as yamlMode from '@codemirror/legacy-modes/mode/yaml';
import { StreamLanguage } from '@codemirror/language';
import CodeMirror from '@uiw/react-codemirror';
import React from 'react';

// @ts-ignore
// temp yaml hack
import SampleConfig from 'in-infrastructure/agentView/ConfigurationEditor/SampleConfig.yaml';

interface ConfigEditorProps {
  agentConfig?: string;
  handleAgentConfigChange: any;
}

export default function ConfigEditor({ agentConfig = SampleConfig, handleAgentConfigChange }: ConfigEditorProps) {
  return (
    <>
      <CodeMirror
        value={agentConfig}
        onChange={handleAgentConfigChange}
        extensions={[StreamLanguage.define(yamlMode.yaml)]}
      />
      ;
    </>
  );
}
