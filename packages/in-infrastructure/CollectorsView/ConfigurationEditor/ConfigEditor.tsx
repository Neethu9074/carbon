/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import * as yamlMode from '@codemirror/legacy-modes/mode/yaml';
import { StreamLanguage } from '@codemirror/language';
import CodeMirror from '@uiw/react-codemirror';
import React from 'react';

interface ConfigEditorProps {
  agentConfig?: string;
  handleAgentConfigChange: () => void;
}

export default function ConfigEditor({ agentConfig, handleAgentConfigChange }: ConfigEditorProps) {
  return (
    <CodeMirror
      value={agentConfig}
      onChange={handleAgentConfigChange}
      extensions={[StreamLanguage.define(yamlMode.yaml)]}
    />
  );
}
