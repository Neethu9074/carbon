/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Language } from 'prism-react-renderer';
import React, { FC } from 'react';

import { expandNestedSerializedJson } from 'in-services/util/json';
import Code from 'in-components/Code';

import locals from './Meta.mless';

interface CodeSnippetProps {
  code: object | string;
  showLineNumbers?: boolean;
  lang: Language;
}

export const CodeSnippet: FC<CodeSnippetProps> = ({ code, showLineNumbers, lang }) => {
  return (
    <Code
      wrapperClassName={locals.meta}
      code={JSON.stringify(expandNestedSerializedJson(code), null, 2)}
      showLineNumbers={showLineNumbers}
      lang={lang}
    />
  );
};
