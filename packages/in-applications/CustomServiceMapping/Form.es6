import { createField, createMapForm, createListForm, notBlankValidator } from 'formalistic';
import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import RemoveSection from 'in-applications/CustomServiceMapping/Remove';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import withPropDependingState from 'in-hoc/withPropDependingState';
import ValidationBlock from 'in-components/form/ValidationBlock';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { servicesList } from 'in-applications/navigation/paths';
import { getTagValuesAsOptions } from 'in-applications/keys';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Form.mless';

export default compose(
  withPropDependingState({
    getInitialState,

    resets: [
      {
        getResettingProps: () => ['serviceConfig'],
        onReset: getInitialState
      }
    ],

    reducerName: 'updateForm',
    reducer: (_, newForm) => ({ form: newForm })
  })
)(CustomServiceConfigForm);

function getInitialState({ serviceConfig }) {
  return {
    form: getInitialForm(serviceConfig)
  };
}

function CustomServiceConfigForm({
  serviceConfig,
  form,
  updateForm,
  onSubmit,
  loading,
  loadingStateName,
  error,
  isNewRule
}) {
  const matchSpecificationForm = form.get('matchSpecification');
  const disabled = loading;

  return (
    <form onSubmit={e => onSubmitInternal(e, form, updateForm, onSubmit)} className={locals.form} disabled={disabled}>
      <Row>
        <Col lg={12}>
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
            Add key
          </Button>
        </Col>
      </Row>

      {!isNewRule && (
        <Row>
          <Col lg={12}>
            <RemoveSection serviceConfig={serviceConfig} />
          </Col>
        </Row>
      )}

      <div className={locals.actions}>
        {error && (
          <ValidationBlock hasError className={locals.saveErrors}>
            {error}
          </ValidationBlock>
        )}

        <Button kind="secondary" href$={getModifiedUrlStream(p => (p.pathname = servicesList))}>
          Cancel
        </Button>

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

function getInitialForm(serviceConfig = {}) {
  const matchSpecificationSubForm = get(serviceConfig, 'matchSpecification', [{}]).reduce(
    (form, matchSpecification) => form.push(getMatchSpecificationForm(matchSpecification)),
    createListForm({
      validator: matchSpecificationValidator
    })
  );

  const serviceConfigExists = serviceConfig.id ? true : false;
  const form = createMapForm()
    .put(
      'id',
      createField({
        value: get(serviceConfig, 'id', '')
      })
    )
    .put(
      'name',
      createField({
        value: get(serviceConfig, 'name', 'custom rule name'),
        validator: notBlankValidator
      })
    )
    .put(
      'label',
      createField({
        value: get(serviceConfig, 'label', 'custom rule label'),
        validator: notBlankValidator
      })
    )
    .put('matchSpecification', matchSpecificationSubForm);

  if (serviceConfigExists) {
    return form;
  }
  return form.setTouched(true);
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
        value: get(matchSpecification, 'value', '/(.*)')
      })
    );
}

function setValue(path, value, form, updateForm) {
  updateForm(form.updateIn(path, field => field.setValue(value).setTouched(true)));
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
