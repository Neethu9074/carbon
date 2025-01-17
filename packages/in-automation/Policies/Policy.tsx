/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Action, Error, Result } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { PolicyFormBody, PolicyFormFooter, PolicyFormHeader } from 'in-automation/Policies/PolicyForm';
import useNavigateToPolicies from 'in-automation/navigation/hooks/useNavigateToPolicies';
import usePolicyDetailsUrlParams from 'in-automation/Policies/usePolicyDetailsUrlParams';
import usePolicyFormSubmission from 'in-automation/Policies/usePolicyFormSubmission';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import usePolicyForm from 'in-automation/Policies/usePolicyForm/usePolicyForm';
import { setViewTrackingDataValues } from 'in-components/ViewTrackingMeta';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { PolicyForm } from 'in-automation/Policies/usePolicyForm/types';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { productAreas } from 'in-services/tracking/productAreas';
import { PolicyFormEntity } from 'in-automation/Policies/types';
import { hasError, isLoading } from 'in-services/util/result';
import SectionLine from 'in-settings/components/SectionLine';
import useTriggers from 'in-automation/Policies/useTriggers';
import { pageNames } from 'in-services/tracking/pageNames';
import usePolicy from 'in-automation/Policies/usePolicy';
import { pendingResult } from 'in-services/fixedObjects';
import Form from 'in-components/form/binding/Form';
import { seconds } from 'in-services/time/time';
import { getActions } from 'in-automation/api';
import { Triggers } from 'in-automation/types';
import Title from 'in-components/Title/Title';
import { Trans, t } from 'in-i18n';

export default function PolicyDetailsWrapper() {
  // Set values for tracking data
  setViewTrackingDataValues(productAreas.automation, pageNames.automation_policies);

  return (
    <>
      <Title title={t('in-automation:policies.policy')} />
      <PolicyDetailsLoader />;
    </>
  );
}

function useActions() {
  return useObservable(getActions, []) ?? (pendingResult as Result<Action[]>);
}

function PolicyDetailsLoader() {
  const { id, isCopy } = usePolicyDetailsUrlParams();
  const actions = useActions();
  const triggers = useTriggers();
  const policy = usePolicy({ id, isCopy });

  const loading = isLoading(policy, actions, ...Object.values(triggers));
  const errored = hasError(policy, actions);

  if (loading) {
    return <LoadingIndicator size={'xl'} />;
  }

  if (errored) {
    const errors = [...policy.errors, ...actions.errors];
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={themes.default.ids.color.option.yellow['500']}>
          {t('in-automation:policies.unknownPolicy')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          <ErroneousResultPresenter errors={errors} />
          <br />
          {t('in-automation:ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  }

  return <PolicyDetails key={String(isCopy)} actions={actions.data!} triggers={triggers} policy={policy.data!} />;
}

interface PolicyDetailsProps {
  policy: PolicyFormEntity;
  actions: Action[];
  triggers: Triggers;
}

function PolicyDetails({ actions, triggers, policy }: PolicyDetailsProps) {
  const { isNew } = usePolicyDetailsUrlParams();
  const navigateToPolicies = useNavigateToPolicies();
  const [form, setForm] = usePolicyForm(policy, actions, triggers);

  const [submitStatus, doSubmit] = usePolicyFormSubmission();

  function onSubmit(form: PolicyForm) {
    const name = form.get('name').value;
    doSubmit({
      payload: { form, triggers, actions },
      onError: res => {
        if (isNew) onSaveFailure(res?.errors);
        else onEditFailure(res?.errors);
      },
      onSuccess: () => {
        if (isNew) onSaveSuccess(name);
        else onEditSuccess(name);
        navigateToPolicies();
      }
    });
  }

  return (
    <Form form={form} setForm={form => setForm(form as PolicyForm)} onSubmit={form => onSubmit(form as PolicyForm)}>
      <PolicyFormHeader policy={policy} />
      <SectionLine />
      <PolicyFormBody actions={actions} triggers={triggers} />
      <PolicyFormFooter submitStatus={submitStatus} />
    </Form>
  );
}

function onSaveSuccess(name: string) {
  addMessage(
    {
      type: 'info',
      timeout: seconds.toMillis(4),
      title: t('in-automation:policies.createDialog.success.title'),
      content: t('in-automation:policies.createDialog.success.content', {
        name
      })
    },
    'policy-save-success'
  );
}

function onSaveFailure(errors: Error[] | undefined) {
  if (errors) {
    errors.forEach(error =>
      addMessage(
        {
          type: 'danger',
          timeout: seconds.toMillis(6),
          title: t('in-automation:policies.createDialog.failure.title'),
          content: (
            <Trans
              i18nKey="in-automation:policies.createDialog.failure.content"
              values={{ errorMessage: error.message }}
            />
          )
        },
        'policy-save-failure'
      )
    );
  } else {
    addMessage(
      {
        type: 'danger',
        timeout: seconds.toMillis(6),
        title: t('in-automation:policies.createDialog.failure.title'),
        content: (
          <Trans
            i18nKey="in-automation:policies.createDialog.failure.content"
            values={{ errorMessage: t('in-components:error.erroneousResultPresenterMessage') }}
          />
        )
      },
      'policy-save-failure'
    );
  }
}

function onEditSuccess(name: string) {
  addMessage(
    {
      type: 'info',
      timeout: seconds.toMillis(4),
      title: t('in-automation:policies.editDialog.success.title'),
      content: t('in-automation:policies.editDialog.success.content', {
        name
      })
    },
    'policy-edit-success'
  );
}

function onEditFailure(errors: Error[] | undefined) {
  if (errors) {
    errors.forEach(error =>
      addMessage(
        {
          type: 'danger',
          timeout: seconds.toMillis(6),
          title: t('in-automation:policies.editDialog.failure.title'),
          content: (
            <Trans
              i18nKey="in-automation:policies.editDialog.failure.content"
              values={{ errorMessage: error.message }}
            />
          )
        },
        'policy-edit-failure'
      )
    );
  } else {
    addMessage(
      {
        type: 'danger',
        timeout: seconds.toMillis(6),
        title: t('in-automation:policies.editDialog.failure.title'),
        content: (
          <Trans
            i18nKey="in-automation:policies.editDialog.failure.content"
            values={{ errorMessage: t('in-components:error.erroneousResultPresenterMessage') }}
          />
        )
      },
      'policy-edit-failure'
    );
  }
}
