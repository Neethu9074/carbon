/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

//@ts-expect-error
import { parse } from 'esprima';
import * as acorn from 'acorn';

import { syntheticNodeJs22Enabled } from 'in-services/featureFlags';
import { Error, ErrorCode } from 'in-types';
import { t } from 'in-i18n';

interface ErrorType {
  description: string;
  lineNumber: string;
  column: string;
}

export function validate(code: string) {
  let errors: Error[] = [];
  let errorCode: ErrorCode = 'VALIDATION';

  try {
    const syntax = parse(code, { tolerant: true, loc: true, range: true });

    if (syntax.errors.length > 0) {
      if (syntheticNodeJs22Enabled) {
        try {
          //sourceType:module is used here to ensure the code is treated as an ES module like .mjs files in  Node.js, which supports import/export syntax and strict mode by default.
          acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
          syntax.errors = [];
        } catch (e) {
          if (e instanceof SyntaxError) {
            errors.push({
              code: errorCode,
              message: e.message
            });
          }
        }
      }
      syntax.errors.forEach((e: ErrorType) => {
        let message =
          e.description.replace(/Invalid/gi, 'Incorrect') +
          '(line number: ' +
          e.lineNumber +
          ', column number: ' +
          e.column +
          ')';
        errors.push({
          code: errorCode,
          message: message
        });
      });
    } else if (syntax.body.length === 0) {
      errors.push({
        code: errorCode,
        message: t('in-synthetics:dialog.createTest.requestStep.emptyScriptFileError')
      });
    }
  } catch (e) {
    let error = e as ErrorType;
    let errorContent = code.split('\n')[(error.lineNumber as unknown as number) - 1];
    let nodeJSOperatorRegex = /(\?\.|\?\?|\?\?=)/;
    let isnodeJSErr = nodeJSOperatorRegex.test(errorContent);
    if (!isnodeJSErr) {
      let message =
        error.description.replace(/Invalid/gi, 'Incorrect') +
        '(line number: ' +
        error.lineNumber +
        ', column number: ' +
        error.column +
        ')';
      errors.push({
        code: errorCode,
        message: message
      });
    }
  }
  return errors;
}
