import { get } from 'lodash';
import React from 'react';

import { build, parse } from 'in-services/validators/urlPath';
import { testRules } from 'in-api/endpointConfiguration';
import FormGroup from 'in-components/form/FormGroup';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';

import locals from './RuleTester.mless';

export default class RuleTester extends React.Component {
  static displayName = 'RuleTester';

  state = {
    testResult: null
  };

  render() {
    const { form, addTestCase, onChangeIn, disabled } = this.props;
    const { loading } = this.state;
    const testCases = form.get('testCases');

    return (
      <div className={locals.ruleTesterWrapper}>
        <h4 className={locals.title}>Rule Tester</h4>
        <ul className={locals.list}>
          {testCases.map((testCase, i) => (
            <li key={i} className={locals.item}>
              <FormGroup>
                <Input
                  type="text"
                  id={'test_case_' + i}
                  value={testCase.value}
                  onChange={e => onChangeIn(['testCases', i], e.target.value)}
                  autoComplete="off"
                />
                {loading ? (
                  <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning width={24} height={24} />
                ) : (
                  this.getTestResultForRuleIndexAndTestCaseIndex(i)
                )}
              </FormGroup>
            </li>
          ))}
        </ul>
        <div className={locals.buttonSection}>
          <Button kind="action" icon="lib_openclose_add" onClick={addTestCase}>
            Add Test
          </Button>
          {testCases.size > 0 && (
            <Button kind="action" icon="lib_actions_refresh" disabled={disabled || loading} onClick={this.checkRule}>
              Check
            </Button>
          )}
        </div>
      </div>
    );
  }

  checkRule = () => {
    const form = this.props.form;
    const query = form.get('query').value;
    const testCases = form.get('testCases').map(testCaseField => testCaseField.value);

    let rulesToCheck = this.getRulesToCheck(testCases);
    rulesToCheck.push({
      enabled: true,
      pathSegments: parse(query),
      testCases
    });

    const result$ = testRules(rulesToCheck);
    this.setState({
      testResult: null,
      loading: true,
      error: false
    });

    result$.once(testResult => {
      this.setState({
        testResult,
        loading: false,
        error: false
      });
    });

    result$.errors().once(() => {
      this.setState({
        loading: false,
        error: true
      });
    });
  };

  getRulesToCheck = testCases => {
    const { rules } = this.props;
    return rules
      .toJS()
      .slice(0, this.props.ruleIndex)
      .filter(rule => rule.enabled)
      .map(rule => {
        rule.testCases = testCases;
        return rule;
      });
  };

  getTestResultForRuleIndexAndTestCaseIndex = testCaseIndex => {
    const testResult = this.state.testResult;
    if (!testResult) {
      return null;
    }

    const ruleIndex = this.props.ruleIndex;
    for (let i = 0; i < ruleIndex; i++) {
      const resultAtRule = get(testResult, [i, testCaseIndex]);
      if (resultAtRule == true) {
        const query = build(this.props.rules.get(i).get('pathSegments').value);
        return (
          <span className={locals.failedTestResult}>{'Passed an earlier rule' + (query ? ` "${query}"` : '')}</span>
        );
      }
    }

    const result = get(testResult, [ruleIndex, testCaseIndex]);
    if (result === false) {
      return <span className={locals.failedTestResult}>Not passed</span>;
    }
    if (result === true) {
      return <span className={locals.successTestResult}>passed</span>;
    }
    return null;
  };
}
