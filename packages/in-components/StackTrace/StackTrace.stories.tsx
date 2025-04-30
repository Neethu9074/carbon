/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error import { StackTraceLines, StackTraceLine, InfoIndicator } from 'in-components/StackTrace';
import { StackTraceLines, StackTraceLine, InfoIndicator } from 'in-components/StackTrace';

export default {
  component: StackTraceLine
};

export function NormalData() {
  return (
    <StackTraceLines>
      <StackTraceLine
        file="webpack:///./packages/in-internal/monitoringUnit/eum/ErrorSimulator.js"
        name="throwSimulatedError"
        line={36}
        column={9}
        indicator={
          <InfoIndicator href="https://instana.com">
            Could not download JavaScript source file because of missing authentication (HTTP response code 401).
            <strong>Click to configure JS Stack Trace Download.</strong>
          </InfoIndicator>
        }
      />
      <StackTraceLine
        file="webpack:///./packages/in-internal/monitoringUnit/eum/ErrorSimulator.js"
        name="addIntermediateFunction"
        line={31}
        column={30}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name="apply"
        line={15}
        column={129}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'apply'}
        line={16}
        column={134}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'apply'}
        line={16}
        column={225}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'invokeGuardedCallbackAndCatchFirstError'}
        line={20}
        column={286}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'za'}
        line={22}
        column={166}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'Da'}
        line={22}
        column={328}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'call'}
        line={21}
        column={211}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'Ba'}
        line={24}
        column={64}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'Ia'}
        line={24}
        column={244}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'Ja'}
        line={88}
        column={233}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'a'}
        line={222}
        column={188}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'Sb'}
        line={44}
        column={355}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'Wb'}
        line={89}
        column={372}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'a'}
        line={223}
        column={101}
      />
      <StackTraceLine
        file="webpack:///./node_modules/react-dom/cjs/react-dom.production.min.js"
        name={'Tb'}
        line={89}
        column={113}
      />
    </StackTraceLines>
  );
}

export function AllCases() {
  return (
    <StackTraceLines>
      <StackTraceLine
        file="webpack:///./packages/in-internal/monitoringUnit/eum/ErrorSimulator.js"
        name="completeExample"
        line={31}
        column={30}
      />
      <StackTraceLine file="MissingName.js" name="" line={31} column={30} />
      <StackTraceLine file="" name="missingFile" line={1} column={3031209} />
      <StackTraceLine file="https://shop.example.com/assets/app.chunk.1.js" name="missingLine" column={3031209} />
      <StackTraceLine
        file="https://shop.example.com/assets/app.chunk.1.js"
        name="lineIsZero"
        line={0}
        column={3031209}
      />
      <StackTraceLine file="https://shop.example.com/assets/app.chunk.1.js" name="missingColumn" line={3031209} />
      <StackTraceLine
        file="https://shop.example.com/assets/app.chunk.1.js"
        name="columnIsZero"
        line={3031209}
        column={0}
      />
      <StackTraceLine
        file="https://shop.example.com/assets/really/really/really/long/long/long/path/to/static/file/it/is/never/going/end/for/real/this/is/stupid/app.chunk.1.js"
        name="reallyLongFile"
        line={5}
        column={12}
      />
      <StackTraceLine
        file="https://shop.example.com/assets/app.chunk.1.js"
        name="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        line={5}
        column={12}
      />
    </StackTraceLines>
  );
}
