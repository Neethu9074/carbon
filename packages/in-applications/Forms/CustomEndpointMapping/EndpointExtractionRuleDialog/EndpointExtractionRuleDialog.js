/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, createMapForm, createListForm } from 'formalistic';
import React from 'react';

import RuleTester from 'in-applications/Forms/CustomEndpointMapping/EndpointExtractionRuleDialog/RuleTester';
import EditConfigDialog from 'in-applications/Forms/components/EditConfigDialog';
import { build, parse, validate } from 'in-services/validators/urlPath';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';

import locals from './EndpointExtractionRuleDialog.mless';

export default function EndpointExtractionRuleDialog(props) {
  return <EditConfigDialog title="Custom HTTP Rule" content={<BasicDialog {...props} />} />;
}

class BasicDialog extends React.Component {
  static displayName = 'BasicDialog';

  constructor(props) {
    super(props);

    this.state = {
      form: getInitialForm(props)
    };
  }

  render() {
    const { rules, onRemove, ruleIndex } = this.props;
    const { form } = this.state;

    return (
      <form onSubmit={e => this.onSubmit(e, form)}>
        <div className={locals.queryFormSection}>
          {form.get('query').map(field => (
            <FormGroup>
              <Input
                type="text"
                id="query"
                value={field.value}
                onChange={e => this.onChange('query', e.target.value)}
                hasError={!field.valid}
                autoComplete="off"
                autoFocus
              />
              <TouchedMessages field={field} />
              <span className={locals.queryHelpText}>{`Specify the path to match, eg. /api/{version}/*`}</span>
              <span
                className={locals.queryHelpText}
              >{`Optionally, add test cases below to ensure the rule works as expected, eg. /api/v2/anything`}</span>
            </FormGroup>
          ))}
        </div>

        <RuleTester
          rules={rules}
          form={form}
          addTestCase={this.addTestCase}
          removeTestCase={this.removeTestCase}
          onChangeIn={this.onChangeIn}
          ruleIndex={ruleIndex}
          disabled={!form.hierarchyValid}
        />

        <div className={locals.footer}>
          <Button kind="create" type="submit" disabled={!form.hierarchyValid}>
            Save
          </Button>
          {onRemove && (
            <Button
              style={{ marginLeft: 0 }}
              kind="subtle"
              size="compact"
              icon="lib_actions_delete"
              onClick={() => {
                close();
                onRemove();
              }}
            >
              Delete Rule
            </Button>
          )}
        </div>
      </form>
    );
  }

  onSubmit(e, form) {
    e.preventDefault();

    if (!form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, { recurse: true })
      });
      return;
    }

    close();

    const rule = form.toJS();
    rule.pathSegments = parse(rule.query);
    this.props.onSave(rule);
  }

  onChange = (fieldName, value) => {
    this.onChangeIn([fieldName], value);
  };

  onChangeIn = (path, value) => {
    this.setState({
      form: this.state.form.updateIn(path, field => field.setValue(value).setTouched(true))
    });
  };

  addTestCase = () => {
    this.setState({
      form: this.state.form.updateIn(['testCases'], list =>
        list
          .push(
            createField({
              value: '/'
            })
          )
          .setTouched(true)
      )
    });
  };

  removeTestCase = index => {
    this.setState({
      form: this.state.form.updateIn(['testCases'], list => list.remove(index).setTouched(true))
    });
  };
}

function getInitialForm(props) {
  const rule = props.rule || {};
  const query = build(rule.pathSegments);

  return createMapForm()
    .put(
      'query',
      createField({
        value: query,
        validator: queryValidator
      })
    )
    .put(
      'testCases',
      (rule.testCases || []).reduce(
        (form, testCase) =>
          form.push(
            createField({
              value: testCase || '/'
            })
          ),
        createListForm({})
      )
    );
}

function queryValidator(query) {
  if (isBlank(query)) {
    return [
      {
        severity: 'error',
        message: 'The value must not be blank.'
      }
    ];
  }

  return validate(parse(query));
}
