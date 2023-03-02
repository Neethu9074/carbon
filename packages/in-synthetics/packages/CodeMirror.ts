/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { javascript as jsMode } from '@codemirror/legacy-modes/mode/javascript';
import { ReactCodeMirrorProps, useCodeMirror } from '@uiw/react-codemirror';
import * as events from '@uiw/codemirror-extensions-events';
import { javascript } from '@codemirror/lang-javascript';
import { StreamLanguage } from '@codemirror/language';
import { EditorView } from '@codemirror/view';

export type CodeProps = ReactCodeMirrorProps;
export { useCodeMirror, javascript, StreamLanguage, EditorView, jsMode, events };
