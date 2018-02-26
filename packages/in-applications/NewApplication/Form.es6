import { createField, createMapForm, createListForm, notBlankValidator, composeValidators } from 'formalistic';
import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import { regularExpressionValidator } from 'in-services/validators/regexp';
import withPropDependingState from 'in-hoc/withPropDependingState';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
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

function NewApplicationForm({ form, updateForm, onSubmit }) {
  return (
    <form onSubmit={e => onSubmitInternal(e, form, updateForm, onSubmit)} className={locals.form}>
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
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Card>

      <Card
        title="Matching"
        header={
          <Button kind="secondary" size="compact" onClick={() => addMatchSpecification(form, updateForm)}>
            Add new tag
          </Button>
        }
        className={locals.matchingCard}
      >
        {form.get('matchSpecification').map((matchSpecification, i) => (
          <div className={locals.matchSpecification} key={i}>
            {matchSpecification.get('key').map(field => (
              <FormGroup className={locals.formGroup}>
                <Label htmlFor={`match-${i}-key`} hasError={!field.valid && field.touched}>
                  Key
                </Label>
                <Input
                  type="text"
                  id={`match-${i}-key`}
                  value={field.value}
                  onChange={e => setValue(['matchSpecification', i, 'key'], e.target.value, form, updateForm)}
                  hasError={!field.valid && field.touched}
                />
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
                  hasError={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
            <SvgIcon
              type="x"
              width={16}
              onClick={() => removeMatchSpecification(i, form, updateForm)}
              className={locals.removeMatchRule}
              tabIndex={0}
              aria-label="Remove this match specification"
            />
          </div>
        ))}
      </Card>

      <div className={locals.actions}>
        <Button kind="primary" type="submit" disabled={!form.hierarchyValid && form.touched}>
          Save
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

function addMatchSpecification(form, updateForm) {
  const additionalSubForm = getMatchSpecificationForm();
  updateForm(form.updateIn(['matchSpecification'], list => list.push(additionalSubForm)));
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

function removeMatchSpecification(i, form, updateForm) {
  updateForm(form.updateIn(['matchSpecification'], list => list.remove(i)));
}

function onSubmitInternal(e, form, updateForm, onSubmit) {
  e.preventDefault();

  if (!form.hierarchyValid) {
    updateForm(form.setTouched(true, { recurse: true }));
  } else {
    onSubmit(form.toJS());
  }
}
