/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import MonacoEditor from '@monaco-editor/react';
import React, { useState } from 'react';

// @ts-ignore
// temp yaml hack
import SampleConfig from 'in-visualize/SampleConfig.yaml';
import { useEditorDidMount } from 'in-visualize/components/EditorContext';

// import { t } from '@instana/i18n-react';

interface ConfigEditorProps {
  agentConfig?: string;
}

export default function ConfigEditor({ agentConfig = SampleConfig }: ConfigEditorProps) {
  const editorDidMount = useEditorDidMount();
  const [config, setConfig] = useState(agentConfig);

  const handleConfigChange = (value: any) => {
    setConfig((value as string) ?? '');
  };

  return <MonacoEditor className="header" onMount={editorDidMount} value={config} onChange={handleConfigChange} />;
}
