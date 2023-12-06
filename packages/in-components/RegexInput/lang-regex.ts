/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { LRLanguage, LanguageSupport } from '@codemirror/language';
import { styleTags, tags as t } from '@lezer/highlight';

import { parser } from 'in-components/RegexInput/regex.grammar';

export const regexLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        QuotedString: t.string,
        RepetitionSpecifier: t.operator,
        IntersectionOperator: t.operator,
        AnyChar: t.character,
        CharClassExp: t.character,
        CharClass: t.character,
        EscapedChar: t.escape,
        UnionOperator: t.operator,
        Number: t.number,
        Idenfitier: t.variableName
      })
    ]
  })
});

export function regex() {
  return [
    new LanguageSupport(regexLanguage),
    regexLanguage.data.of({ closeBrackets: { brackets: ['(', '[', '"', '<'] } })
  ];
}
