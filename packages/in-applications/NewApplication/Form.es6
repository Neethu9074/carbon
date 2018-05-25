import { createField, createMapForm, createListForm, notBlankValidator, composeValidators } from 'formalistic';
import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import { regularExpressionValidator } from 'in-services/validators/regexp';
import withPropDependingState from 'in-hoc/withPropDependingState';
import RemoveSection from 'in-applications/NewApplication/Remove';
import ValidationBlock from 'in-components/form/ValidationBlock';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { getTagValuesAsOptions } from 'in-applications/keys';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Form.mless';

export default compose(
  withPropDependingState({
    getInitialState,

    resets: [
      {
        getResettingProps: () => ['application'],
        onReset: getInitialState
      }
    ],

    reducerName: 'updateForm',
    reducer: (_, newForm) => ({ form: newForm })
  })
)(NewApplicationForm);

function getInitialState({ application }) {
  return {
    form: getInitialForm(application)
  };
}

function NewApplicationForm({
  application,
  form,
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
      <Row>
        <Col lg={12}>
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

              {application && (
                <HelpText>
                  Renaming an application is an eventually consistent action within the Instana system. For this reason,
                  a change to an application name may take <em>up to a few minutes</em> until it has populated
                  throughout the whole system.
                </HelpText>
              )}

              <HelpText>
                {`Application names should have a well established definition within an organization. For example, to
                model an environment: "Production Blue", to model a set of services "Users", or to model a tenant: "ACME
                Customer"`}
              </HelpText>
            </FormGroup>
          ))}
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <HelpText className={locals.matchHelp}>
            {`Define the the application through as many tags (key/value pairs) as desired. For example: key as
            "docker.label" and value as "environment=Production Blue". Regular expressions can be used for the value.
            When all conditions specified here match a call, it will be considered part of this application."`}
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
                    {getTagValuesAsOptions()}
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

              {matchSpecificationForm.size > 1 && (
                <Tooltip content="Remove this match condition">
                  <SvgIcon
                    className={locals.removeMatchRuleIcon}
                    type="lib_openclose_cancel"
                    width={24}
                    onClick={disabled ? null : () => removeMatchSpecification(i, form, updateForm)}
                    tabIndex={0}
                    aria-label="Remove this match condition"
                  />
                </Tooltip>
              )}
            </div>
          ))}

          <Button
            className={locals.addRuleButton}
            kind="action"
            onClick={disabled ? null : () => addMatchSpecification(form, updateForm)}
            icon="lib_openclose_add_circle_outline"
          >
            Add rule
          </Button>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <RemoveSection application={application} />
        </Col>
      </Row>

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
          {loading ? loadingStateName : 'Create'}
        </Button>
      </div>
    </form>
  );
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

function addMatchSpecification(form, updateForm) {
  const additionalSubForm = getMatchSpecificationForm();
  updateForm(form.updateIn(['matchSpecification'], list => list.push(additionalSubForm).setTouched(true)));
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
