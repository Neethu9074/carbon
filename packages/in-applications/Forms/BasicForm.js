/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { Spacer, SvgIcon, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { pendingResult } from 'in-services/fixedObjects';
import Tooltip from 'in-components/Tooltip';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './BasicForm.mless';

export default function BasicFormPropsEnrichment(props) {
  const entityResult = useObservable(props.getEntity(), []) ?? pendingResult;
  const [form, updateForm] = useState(getInitialState(props.getInitialForm, entityResult.data));

  useEffect(
    () => updateForm(getInitialState(props.getInitialForm, entityResult.data)),
    [entityResult.data, props.getInitialForm]
  );

  return <BasicForm {...props} form={form} updateForm={updateForm} entityResult={entityResult} />;
}

function getInitialState(getInitialForm, entityResultData) {
  if (entityResultData) {
    return getInitialForm(entityResultData);
  }
}

function BasicForm({
  updateForm,
  updateFormOnSubmit,
  getOnSavePath,
  updateEntity,
  entityResult,
  title,
  renderFormContent,
  generalHelpText,
  onCancelHref,
  form,
  savingStateName = t('in-applications:labelSaving'),
  saveButtonLabel = t('in-applications:buttonSave')
}) {
  const [state, setState] = useState({ success: false, saving: false, error: false });
  const { goToPath } = useNavigation();

  function onSubmit(e, form) {
    e.preventDefault();

    if (updateFormOnSubmit) {
      form = updateFormOnSubmit(form);
    }

    if (!form.hierarchyValid) {
      updateForm(form.setTouched(true, { recurse: true }));
      return;
    }

    const entityToUpdate = form.toJS();
    const result$ = updateEntity(entityToUpdate);
    setState({
      saving: true,
      success: false,
      error: false
    });

    result$.once(result => {
      setState({
        success: true,
        saving: false,
        error: false
      });

      if (getOnSavePath) {
        goToPath(getOnSavePath(result));
      }
    });

    result$.errors().once(() => {
      setState({
        success: false,
        saving: false,
        error: true
      });
    });
  }

  function setValue(updateForm, path, value, form) {
    updateForm(form.updateIn(path, field => field.setValue(value).setTouched(true)));
  }

  const _updateForm = form => updateForm(form.setTouched(true, { recurse: false }));
  const { saving, error, success } = state;

  const isLoading = entityResult.progress.loading;
  const hasErrors = entityResult.errors.length > 0;

  let content;
  if (isLoading) {
    content = <LoadingIndicator text={t('in-applications:loadingData')} height={100} />;
  } else if (hasErrors) {
    content = <ErroneousResultPresenter errors={entityResult.errors} />;
  } else {
    content = (
      <form onSubmit={e => onSubmit(e, form)} className={locals.form}>
        {form && renderFormContent(entityResult.data, form, (...args) => setValue(_updateForm, ...args), _updateForm)}

        <Spacer vertical="normal" />
        <div className={locals.footer}>
          {onCancelHref && (
            <Button kind="subtle" size="compact" href={onCancelHref}>
              {t('in-applications:buttonCancel')}
            </Button>
          )}
          {!onCancelHref && <div />}

          {form && form.touched && (
            <Button
              icon={saving ? 'lib_actions_loading' : null}
              iconSpinning
              kind="create"
              type="submit"
              disabled={(!form.hierarchyValid && form.touched) || saving}
            >
              {saving ? savingStateName : saveButtonLabel}
            </Button>
          )}
        </div>
      </form>
    );
  }

  return (
    <div>
      <Title title={title} />
      {(title || generalHelpText) && (
        <div className={locals.header}>
          {title && <h1 className={locals.heading}>{title}</h1>}
          {generalHelpText && (
            <Tooltip themeStyle="light" content={generalHelpText}>
              <SvgIcon className={locals.helpTextIcon} type="lib_help_error_help_outline" />
            </Tooltip>
          )}
        </div>
      )}

      {title && <Spacer vertical="normal" />}
      {content}
      {success && (
        <TemporaryMessage
          message={`${t('in-applications:messageSuccessfullySaved')} ${t('in-applications:messageWaitForChanges')}`}
          type="success"
        />
      )}
      {error && <TemporaryMessage message={t('in-applications:messageErrorOccurred')} type="error" />}
    </div>
  );
}

export function matchSpecificationValidator(items) {
  if (items.length < 1) {
    return [
      {
        severity: 'error',
        message: t('in-applications:forms.customSyntheticRule.errorConditionRequired')
      }
    ];
  }

  return null;
}
