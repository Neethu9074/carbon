import { createField, createMapForm, createListForm, notBlankValidator, composeValidators } from 'formalistic';
import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import { regularExpressionValidator } from 'in-services/validators/regexp';
import withPropDependingState from 'in-hoc/withPropDependingState';
import RemoveSection from 'in-applications/NewApplication/Remove';
import ValidationBlock from 'in-components/form/ValidationBlock';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Card from 'in-new-components/Card';

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
          <Card title="General">
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
                    Renaming an application is an eventually consistent action within the Instana system. For this
                    reason, a change to an application name may take <em>up to a few minutes</em> until it has populated
                    throughout the whole system.
                  </HelpText>
                )}

                <HelpText>
                  Good application names are names that are already well established within an organization. They
                  facilitate concise communication and have a defined meaning. What you configure here, will be used
                  throughout Instana to refer to this application.
                </HelpText>
              </FormGroup>
            ))}
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card title="Matching">
            <HelpText className={locals.matchHelp}>
              Select the services that make up your application by specifying what tags they have in common. We call
              these match conditions. When all conditions match, the service and endpoint are considered to be part of
              this application.
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
                      {getTagValues()}
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
                      type="x"
                      width={20}
                      onClick={disabled ? null : () => removeMatchSpecification(i, form, updateForm)}
                      className={locals.removeMatchRule}
                      tabIndex={0}
                      aria-label="Remove this match condition"
                    />
                  </Tooltip>
                )}
              </div>
            ))}

            <div className={locals.addRule} onClick={disabled ? null : () => addMatchSpecification(form, updateForm)}>
              <SvgIcon
                className={locals.addRuleIcon}
                type="plus"
                width={16}
                height={16}
                aria-label="add a new match condition"
              />
              Add rule
            </div>
          </Card>
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
          {loading ? loadingStateName : 'Save'}
        </Button>
      </div>
    </form>
  );
}

function getTagValues() {
  return [
    { value: '', label: 'Please select' },
    { label: 'cassandra.cluster.name' },
    { label: 'docker.containerName' },
    { label: 'docker.image' },
    { label: 'docker.label' },
    { label: 'dropwizard.name' },
    { label: 'elasticsearch.cluster.name' },
    { label: 'host.fqdn' },
    { label: 'host.name' },
    { label: 'host.os.name' },
    { label: 'host.tag.env' },
    { label: 'host.zone' },
    { label: 'agent.zone' },
    { label: 'ec2.zone' },
    { label: 'azure.zone' },
    { label: 'gce.zone' },
    { label: 'nova.zone' },
    { label: 'jvm.app.name' },
    { label: 'kafka.cluster.name' },
    { label: 'kubernetes.container.name' },
    { label: 'marathon.appId' },
    { label: 'nodejs.app.name' },
    { label: 'nomad.jobName' },
    { label: 'nomad.taskName' },
    { label: 'ruby.name' },
    { label: 'springboot.name' }
  ].map(tag => {
    return (
      <option value={tag.value || tag.label} key={tag.label}>
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
