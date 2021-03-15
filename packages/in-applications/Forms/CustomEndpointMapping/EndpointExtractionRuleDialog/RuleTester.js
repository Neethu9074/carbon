/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';
import { get } from 'lodash';
import React from 'react';

import { build, parse, validate } from 'in-services/validators/urlPath';
import { testRules } from 'in-api/endpointConfiguration';
import FormGroup from 'in-components/form/FormGroup';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './RuleTester.mless';

export default class RuleTester extends React.Component {
  static displayName = 'RuleTester';

  constructor(props) {
    super(props);

    this.onSuccess$ = null;
    this.onError$ = null;

    this.state = {
      testResult: null
    };

    this.signal = create();
  }

  componentDidMount() {
    this.signalSubscription = this.signal.debounce(500).subscribe(this.checkRule);
    this.checkRule();
  }

  componentWillUnmount() {
    if (this.signalSubscription) {
      this.signalSubscription.dispose();
      this.signalSubscription = null;
    }
    if (this.onSuccess$) {
      this.onSuccess$.dispose();
      this.onSuccess$ = null;
    }
    if (this.onError$) {
      this.onError$.dispose();
      this.onError$ = null;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.form !== this.props.form) {
      this.signal.emit(true);
    }
  }

  render() {
    const { form, addTestCase, removeTestCase, onChangeIn } = this.props;
    const { loading } = this.state;

    return (
      <div className={locals.ruleTesterWrapper}>
        <div className={locals.header}>
          <h4 className={locals.title}>{t('in-applications:titleRuleTester')}</h4>
          <Button kind="action" icon="lib_openclose_add" onClick={addTestCase}>
            {t('in-applications:buttonAddTest')}
          </Button>
        </div>
        <ul className={locals.list}>
          {form.get('testCases').map((testCase, i) => (
            <li key={i} className={locals.item}>
              <FormGroup>
                <div className={locals.inputRow}>
                  <Input
                    className={locals.input}
                    type="text"
                    id={'test_case_' + i}
                    value={testCase.value}
                    onChange={e => onChangeIn(['testCases', i], e.target.value)}
                    autoComplete="off"
                  />
                  <SvgIcon
                    className={locals.removeTestCaseIcon}
                    type="lib_actions_delete"
                    size="xs"
                    onClick={() => removeTestCase(i)}
                  />
                </div>
                {loading ? (
                  <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning />
                ) : (
                  this.getTestResultForRuleIndexAndTestCaseIndex(i)
                )}
              </FormGroup>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  checkRule = () => {
    const form = this.props.form;

    const testCases = form.get('testCases').map(testCaseField => testCaseField.value);
    const query = form.get('query').value;

    if (testCases.length === 0 || !query) {
      this.setState({
        testResult: null,
        loading: false,
        error: false
      });
      return;
    }

    const parsedQuery = parse(query);
    if (validate(parsedQuery)) {
      this.setState({
        testResult: null,
        loading: false,
        error: false
      });
      return;
    }

    let rulesToCheck = this.getRulesToCheck(testCases);
    rulesToCheck.push({
      enabled: true,
      pathSegments: parsedQuery,
      testCases
    });

    const result$ = testRules(rulesToCheck);
    this.setState({
      testResult: null,
      loading: true,
      error: false
    });

    this.onSuccess$ = result$.once(testResult => {
      this.setState({
        testResult,
        loading: false,
        error: false
      });
      this.onSuccess$ = null;
    });

    this.onError$ = result$.errors().once(() => {
      this.setState({
        loading: false,
        error: true
      });
      this.onError$ = null;
    });
  };

  getRulesToCheck = testCases => {
    const { rules } = this.props;
    return rules
      .toJS()
      .slice(0, this.props.ruleIndex)
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
      const enabled = this.props.rules.get(i).get('enabled').value;
      if (!enabled) {
        continue;
      }

      const resultAtRule = get(testResult, [i, testCaseIndex]);
      if (resultAtRule == true) {
        const query = build(this.props.rules.get(i).get('pathSegments').value);
        return (
          <span className={locals.failedTestResult}>
            {query
              ? t('in-applications:forms.earlyRuleResultWithQuery', {
                  query: query
                })
              : t('in-applications:forms.earlyRuleResult')}
          </span>
        );
      }
    }

    const result = get(testResult, [ruleIndex, testCaseIndex]);
    if (result === false) {
      return <span className={locals.failedTestResult}>{t('in-applications:forms.testFailed')}</span>;
    }
    if (result === true) {
      return <span className={locals.successTestResult}>{t('in-applications:forms.testPassed')}</span>;
    }
    return null;
  };
}
