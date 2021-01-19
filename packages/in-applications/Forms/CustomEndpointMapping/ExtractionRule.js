/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';

import Rule from 'in-applications/Forms/components/Rule';
import { build } from 'in-services/validators/urlPath';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ExtractionRule.mless';

const ExtractionRule = forwardRef(function ExtractionRule(
  { rule, reorderable, onToggleEnable, isInstanaDefaultRule = false, testResult, onClick },
  ref
) {
  return (
    <Rule
      name={rule.query || build(rule.pathSegments)}
      content={!isInstanaDefaultRule && <TestResult testResult={testResult} rule={rule} />}
      enabled={rule.enabled}
      reorderable={reorderable}
      isInstanaDefaultRule={isInstanaDefaultRule}
      onToggleEnable={onToggleEnable}
      onEdit={() => onClick(rule)}
      ref={ref}
    />
  );
});
export default ExtractionRule;

function TestResult({ testResult, rule }) {
  if (!rule.enabled) {
    return null;
  }

  if (rule.testCases.length === 0) {
    return <span className={locals.notTestedTestResult}>No tests defined</span>;
  }

  if (!testResult) {
    return <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning />;
  }

  let numSucceededTests = 0;
  for (let i = 0; i < testResult.length; i++) {
    if (testResult[i]) {
      numSucceededTests++;
    }
  }
  let numFailedTests = testResult.length - numSucceededTests;

  if (numSucceededTests === testResult.length) {
    return <span className={locals.successTestResult}>All tests passed</span>;
  }

  if (numFailedTests === testResult.length) {
    return <span className={locals.failedTestResult}>All tests failed</span>;
  }

  return (
    <div className={locals.labelRow}>
      <span className={locals.failedTestResult}>{`Tests failed: ${numFailedTests}`}</span>
      <span className={locals.notTestedTestResult}>{`, passed: ${numSucceededTests} out of ${testResult.length}`}</span>
    </div>
  );
}
