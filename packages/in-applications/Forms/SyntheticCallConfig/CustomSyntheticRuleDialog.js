/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { get } from 'lodash';
import React from 'react';

import EditConfigDialog from 'in-applications/Forms/components/EditConfigDialog';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import TagFilterEditor from 'in-analyze/Dialogs/components/TagFilterEditor';
import { stringMaxLengthValidator } from 'in-services/validators/string';
import { disabledOperators } from 'in-analyze/applicationFilter';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { close } from 'in-components/DialogPresenter/store';
import FormTextArea from 'in-components/form/TextArea';
import FormGroup from 'in-components/form/FormGroup';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';

import locals from './CustomSyntheticRuleDialog.mless';

const DEFAULT_KEY = 'endpoint.name';

export default function CustomSyntheticRuleDialog(props) {
  return <EditConfigDialog title="Custom Synthetic Rule" content={<EditRuleForm {...props} />} />;
}

class EditRuleForm extends React.Component {
  static displayName = 'EditRuleForm';

  constructor(props) {
    super(props);

    this.state = {
      form: getInitialForm(props.rule),
      addDescription: get(props.rule, 'description', '') != ''
    };
  }

  render() {
    const { onRemove } = this.props;
    const { form, addDescription } = this.state;

    const nameField = form.get('name');
    const descriptionField = form.get('description');
    const matchSpecificationForm = form.get('matchSpecification');
    const keyField = matchSpecificationForm.get('key');
    const operatorField = matchSpecificationForm.get('operator');
    const valueField = matchSpecificationForm.get('value');

    return (
      <form onSubmit={e => this.onSubmit(e, form)}>
        <div className={locals.nameSection}>
          <FormGroup>
            <div className={locals.helpText}>{'Name Rule'}</div>
            <Input
              type="text"
              id="name"
              placeholder="Name your rule"
              value={nameField.value}
              onChange={e => this.onChange('name', e.target.value)}
              hasError={!nameField.valid && nameField.touched}
              autoComplete="off"
              autoFocus
            />
            <TouchedMessages field={nameField} />
          </FormGroup>
          <FormGroup>
            {addDescription ? (
              <FormTextArea
                type="text"
                id="description"
                placeholder="Add a description for your rule"
                rows="3"
                value={descriptionField.value}
                onChange={e => this.onChange('description', e.target.value)}
              />
            ) : (
              <div>
                <Button kind="action" className={locals.addDescriptionButton} onClick={this.onAddDescription}>
                  Add description
                </Button>
                <span className={locals.helpText}>(optional)</span>
              </div>
            )}
          </FormGroup>
        </div>

        <div className={locals.conditionSection}>
          <div className={locals.helpText}>{'Specify the rules to match, eg. endpoint.name contains health'}</div>

          <TagFilterEditor
            keys={['endpoint.name']}
            tagKey={keyField.value}
            operator={operatorField.value}
            value={valueField.value}
            nameFieldMessages={keyField.messages}
            valueFieldMessages={valueField.messages}
            onChange={this.onChange}
            autoFocus={false}
            disabledOperators={disabledOperators.syntheticEndpointConfig}
          />
        </div>

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
    this.props.onSave(rule);
  }

  onChange = (fieldName, value) => {
    if (fieldName == 'name' || fieldName == 'description') {
      this.onChangeIn([fieldName], value);
    } else {
      this.onChangeIn(['matchSpecification', fieldName], value);
    }
  };

  onChangeIn = (path, value) => {
    this.setState({
      form: this.state.form.updateIn(path, field => field.setValue(value).setTouched(true))
    });
  };

  onAddDescription = () => {
    this.setState({ addDescription: true });
  };
}

export function getInitialForm(rule = {}) {
  return createMapForm()
    .put(
      'name',
      createField({
        value: get(rule, 'name', ''),
        validator: composeAndShortCircuitOnError(stringMaxLengthValidator(256), notBlankValidator)
      })
    )
    .put(
      'enabled',
      createField({
        value: get(rule, 'enabled', true)
      })
    )
    .put(
      'description',
      createField({
        value: get(rule, 'description', '')
      })
    )
    .put('matchSpecification', getMatchSpecificationForm(get(rule, 'matchSpecification')));
}

function getMatchSpecificationForm(matchSpecification = {}) {
  return createMapForm()
    .put(
      'key',
      createField({
        value: get(matchSpecification, 'key', DEFAULT_KEY),
        validator: notBlankValidator
      })
    )
    .put(
      'value',
      createField({
        value: get(matchSpecification, 'value', ''),
        validator: notBlankValidator
      })
    )
    .put(
      'operator',
      createField({
        value: get(matchSpecification, 'operator', 'EQUALS')
      })
    );
}
