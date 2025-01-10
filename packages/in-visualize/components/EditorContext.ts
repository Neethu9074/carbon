/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { OnMount } from '@monaco-editor/react';
import React, { createContext } from 'react';

export const EditorContext = createContext<OnMount | undefined>(undefined);

export function useEditorDidMount() {
  return React.useContext(EditorContext);
}

export function useEditorRef() {
  return React.useContext(EditorContext);
}

export default EditorContext;
