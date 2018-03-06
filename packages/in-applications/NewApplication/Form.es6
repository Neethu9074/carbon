import { createField, createMapForm, createListForm, notBlankValidator, composeValidators } from 'formalistic';
import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import { regularExpressionValidator } from 'in-services/validators/regexp';
import withPropDependingState from 'in-hoc/withPropDependingState';
import ValidationBlock from 'in-components/form/ValidationBlock';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Select from 'in-components/form/Select';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Card from 'in-new-components/Card';

import locals from './Form.mless';

export default compose(
  withPropDependingState({
    resettingProps: ['application'],
    onReset: ({ application }) => ({
      form: getInitialForm(application)
    }),
    reducerName: 'updateForm',
    reducer: (_, newForm) => ({ form: newForm })
  })
)(NewApplicationForm);

function NewApplicationForm({
  form,
  application,
  updateForm,
  onSubmit,
  loading,
  loadingStateName,
  error,
  hrefOnCancel$
}) {
  const matchSpecificationForm = form.get('matchSpecification');
  const disabled = loading;

  return (
    <form onSubmit={e => onSubmitInternal(e, form, updateForm, onSubmit)} className={locals.form} disabled={disabled}>
      {application == null && (
        <Card title="General" className={locals.generalCard}>
          {form.get('label').map(field => (
            <FormGroup className={locals.formGroup}>
              <Label htmlFor="label" hasError={!field.valid && field.touched}>
                Application Name
              </Label>
              <Input
                type="text"
                id="label"
                value={field.value}
                onChange={e => setValue(['label'], e.target.value, form, updateForm)}
                autoComplete="off"
                hasError={!field.valid && field.touched}
                autoFocus
                disabled={disabled}
              />
              <TouchedMessages field={field} />
              <HelpText>
                Good application names are names that are already well established within an organization. They
                facilitate concise communication and have a defined meaning. What you configure here, will be used
                throughout Instana to refer to this application.
              </HelpText>
            </FormGroup>
          ))}
        </Card>
      )}

      <Card
        title="Matching"
        /*header={
          <Button
            disabled={disabled}
            kind="secondary"
            size="compact"
            onClick={() => addMatchSpecification(form, updateForm)}
          >
            Add condition
          </Button>
        }*/
        className={locals.matchingCard}
      >
        <HelpText className={locals.matchHelp}>
          Select the services that make up your application by specifying what tags they have in common. We call these
          match conditions. When all conditions match, the service and endpoint are considered to be part of this
          application.
        </HelpText>

        {matchSpecificationForm.touched && <TouchedMessages field={matchSpecificationForm} />}

        {matchSpecificationForm.map((matchSpecification, i) => (
          <div className={locals.matchSpecification} key={i}>
            {matchSpecification.get('key').map(field => (
              <FormGroup className={locals.formGroup}>
                <Label htmlFor={`match-${i}-key`} hasError={!field.valid && field.touched}>
                  Key
                </Label>
                <Select
                  id={`match-${i}-key`}
                  value={field.value}
                  onChange={e => setValue(['matchSpecification', i, 'key'], e.target.value, form, updateForm)}
                  autoComplete="off"
                  hasError={!field.valid && field.touched}
                  disabled={disabled}
                >
                  {getFakedEdmundsValues()}
                </Select>
                <TouchedMessages field={field} />
              </FormGroup>
            ))}

            {matchSpecification.get('value').map(field => (
              <FormGroup className={locals.formGroup}>
                <Label htmlFor={`match-${i}-value`} hasError={!field.valid && field.touched}>
                  Value
                </Label>
                <Input
                  type="text"
                  id={`match-${i}-value`}
                  value={field.value}
                  onChange={e => setValue(['matchSpecification', i, 'value'], e.target.value, form, updateForm)}
                  autoComplete="off"
                  hasError={!field.valid && field.touched}
                  placeholder=".*"
                  disabled={disabled}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}

            <Tooltip content="Remove this match condition">
              <SvgIcon
                type="x"
                width={20}
                onClick={disabled ? null : () => removeMatchSpecification(i, form, updateForm)}
                className={locals.removeMatchRule}
                tabIndex={0}
                aria-label="Remove this match condition"
              />
            </Tooltip>
          </div>
        ))}
      </Card>

      <div className={locals.actions}>
        {error && (
          <ValidationBlock hasError className={locals.saveErrors}>
            {error}
          </ValidationBlock>
        )}
        {hrefOnCancel$ && (
          <Button kind="secondary" href$={hrefOnCancel$}>
            Cancel
          </Button>
        )}
        <Button
          icon={loading ? 'spinner' : null}
          iconSpinning
          kind="primary"
          type="submit"
          disabled={disabled || (!form.hierarchyValid && form.touched)}
        >
          {loading ? loadingStateName : 'Save'}
        </Button>
      </div>
    </form>
  );
}

function getFakedEdmundsValues() {
  return [
    { value: '', label: 'Please select' },
    { value: 'host.zone', label: 'host.zone' },
    { value: 'docker.label.com.amazonaws.ecs.cluster', label: 'docker.label.com.amazonaws.ecs.cluster' },
    { value: 'docker.label.ARTIFACT_ID ', label: 'docker.label.ARTIFACT_ID ' },
    { value: 'docker.label.ARTIFACT_VERSION', label: 'docker.label.ARTIFACT_VERSION' }
  ].map(tag => {
    return (
      <option value={tag.value} key={tag.label}>
        {tag.label}
      </option>
    );
  });
}

function getInitialForm(application = {}) {
  const matchSpecificationSubForm = get(application, 'matchSpecification', [{}]).reduce(
    (form, matchSpecification) => form.push(getMatchSpecificationForm(matchSpecification)),
    createListForm({
      validator: matchSpecificationValidator
    })
  );

  return createMapForm()
    .put(
      'id',
      createField({
        value: get(application, 'id', undefined)
      })
    )
    .put(
      'label',
      createField({
        value: get(application, 'label', ''),
        validator: notBlankValidator
      })
    )
    .put('matchSpecification', matchSpecificationSubForm);
}

function matchSpecificationValidator(items) {
  if (items.length < 1) {
    return [
      {
        severity: 'error',
        message: 'At least one match condition is required.'
      }
    ];
  }
  return null;
}

function setValue(path, value, form, updateForm) {
  updateForm(form.updateIn(path, field => field.setValue(value).setTouched(true)));
}

/*
function addMatchSpecification(form, updateForm) {
  const additionalSubForm = getMatchSpecificationForm();
  updateForm(form.updateIn(['matchSpecification'], list => list.push(additionalSubForm).setTouched(true)));
}
*/
function getMatchSpecificationForm(matchSpecification = {}) {
  return createMapForm()
    .put(
      'key',
      createField({
        value: get(matchSpecification, 'key', ''),
        validator: notBlankValidator
      })
    )
    .put(
      'value',
      createField({
        value: get(matchSpecification, 'value', ''),
        validator: composeValidators(notBlankValidator, regularExpressionValidator)
      })
    );
}

function removeMatchSpecification(i, form, updateForm) {
  updateForm(form.updateIn(['matchSpecification'], list => list.remove(i).setTouched(true)));
}

function onSubmitInternal(e, form, updateForm, onSubmit) {
  e.preventDefault();

  if (!form.hierarchyValid) {
    updateForm(form.setTouched(true, { recurse: true }));
  } else {
    onSubmit(form.toJS());
  }
}
