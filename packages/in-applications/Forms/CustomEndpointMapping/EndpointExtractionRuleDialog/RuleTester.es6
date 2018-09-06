import { create } from 'reactive-observables';
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

  constructor(props) {
    super(props);

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
        <h4 className={locals.title}>Rule Tester</h4>
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
                    width={16}
                    height={16}
                    onClick={() => removeTestCase(i)}
                  />
                </div>
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
        </div>
      </div>
    );
  }

  checkRule = () => {
    const form = this.props.form;

    const testCases = form.get('testCases').map(testCaseField => testCaseField.value);
    if (testCases.size === 0) {
      this.setState({
        testResult: null,
        loading: false,
        error: false
      });
      return;
    }

    const query = form.get('query').value;
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
