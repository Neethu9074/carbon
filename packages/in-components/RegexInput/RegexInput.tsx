/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { HighlightStyle, bracketMatching, syntaxHighlighting } from '@codemirror/language';
import CodeMirror, { minimalSetup } from '@uiw/react-codemirror';
import { Command, EditorView, keymap } from '@codemirror/view';
import { closeBrackets } from '@codemirror/autocomplete';
import { EditorState } from '@codemirror/state';
import { tags as t } from '@lezer/highlight';
import classNames from 'classnames';
import React from 'react';

import { themes } from '@instana/design-tokens';

import { regex } from 'in-components/RegexInput/lang-regex';

import locals from 'in-components/RegexInput/RegexInput.mless';

interface Props {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  className?: string;
  placeholder?: string;
  onEnter?: () => void;
}

const customizedTheme = EditorView.theme({
  '&.cm-editor.cm-focused': {
    outline: 'none'
  }
});

function toCommand(handler?: () => void): Command {
  return () => {
    handler?.();
    return true;
  };
}

export default function RegexInput({ value, onChange, className, placeholder, onEnter, autoFocus }: Props) {
  const option = themes.default.ids.color.option;

  const highlightingStyle = HighlightStyle.define([
    { tag: t.string, color: option.green[500] },
    { tag: t.operator, color: option.blue[500] },
    { tag: t.number, color: option.black[500] },
    { tag: t.variableName, color: option.neutral[500] },
    { tag: t.character, color: option.orange[500] },
    { tag: t.escape, color: option.indigo[500] }
  ]);

  return (
    <div className={classNames(locals.container, className)}>
      <CodeMirror
        autoFocus={autoFocus}
        onChange={onChange}
        basicSetup={false}
        value={value}
        extensions={[
          minimalSetup(),
          regex(),
          syntaxHighlighting(highlightingStyle),
          singleLine(),
          keymap.of([
            {
              key: 'Enter',
              run: toCommand(onEnter)
            }
          ]),
          bracketMatching(),
          closeBrackets()
        ]}
        theme={customizedTheme}
        placeholder={placeholder}
      />
    </div>
  );
}

function singleLine() {
  return EditorState.transactionFilter.of(tr => (tr.newDoc.lines > 1 ? [] : tr));
}
