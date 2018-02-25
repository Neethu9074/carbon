import { createField, createMapForm, createListForm, notBlankValidator, composeValidators } from 'formalistic';
import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import { regularExpressionValidator } from 'in-services/validators/regexp';
import withPropDependingState from 'in-hoc/withPropDependingState';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';

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
      {form.get('label').map(field => (
        <FormGroup>
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

      {form.get('matchSpecification').map((matchSpecification, i) => (
        <Row key={i}>
          <Col lg={5}>
            {matchSpecification.get('key').map(field => (
              <FormGroup>
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
          </Col>
          <Col lg={5}>
            {matchSpecification.get('value').map(field => (
              <FormGroup>
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
          </Col>
          <Col lg={2} className={locals.removeWrapper}>
            <Button kind="danger" onClick={() => removeMatchSpecification(i, form, updateForm)} size="sm">
              Remove tag
            </Button>
          </Col>
        </Row>
      ))}

      <div className={locals.actions}>
        <Button kind="primary" onClick={() => addMatchSpecification(form, updateForm)}>
          Add new tag
        </Button>
        <Button kind="success" type="submit" disabled={!form.hierarchyValid && form.touched}>
          Save
        </Button>
      </div>
    </form>
  );
}

function getInitialForm(application = {}) {
  const matchSpecificationSubForm = get(application, 'matchSpecification', []).reduce(
    (form, matchSpecification) => form.add(getMatchSpecificationForm(matchSpecification)),
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
