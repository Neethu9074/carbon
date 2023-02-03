/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ReactCodeMirrorProps, useCodeMirror } from '@uiw/react-codemirror';
import * as events from '@uiw/codemirror-extensions-events';
import { javascript } from '@codemirror/lang-javascript';
import { bbedit } from '@uiw/codemirror-theme-bbedit';
import { EditorView } from '@codemirror/view';

export type CodeProps = ReactCodeMirrorProps;
export { javascript, bbedit, useCodeMirror, EditorView, events };
