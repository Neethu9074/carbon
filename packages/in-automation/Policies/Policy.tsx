/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Action, Error, Policy, Result } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { PolicyFormBody, PolicyFormFooter, PolicyFormHeader } from 'in-automation/Policies/PolicyForm';
import { getPolicyActionFromActions, getPolicyTriggerFromTriggers } from 'in-automation/utils/policy';
import usePolicyForm, { getPolicyFromForm, PolicyForm } from 'in-automation/Policies/usePolicyForm';
import useNavigateToPolicies from 'in-automation/navigation/hooks/useNavigateToPolicies';
import { policyDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { setViewTrackingDataValues } from 'in-components/ViewTrackingMeta';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { getActions, saveNewPolicy, savePolicy } from 'in-automation/api';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { isAutomatic, isManual } from 'in-automation/utils/policy';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { productAreas } from 'in-services/tracking/productAreas';
import { PolicyFormEntity } from 'in-automation/Policies/types';
import { hasError, isLoading } from 'in-services/util/result';
import SectionLine from 'in-settings/components/SectionLine';
import useTriggers from 'in-automation/Policies/useTriggers';
import { isAIActionCopy } from 'in-automation/utils/action';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { pageNames } from 'in-services/tracking/pageNames';
import { useSegmentTracker } from 'in-automation/tracker';
import usePolicy from 'in-automation/Policies/usePolicy';
import { pendingResult } from 'in-services/fixedObjects';
import Form from 'in-components/form/binding/Form';
import { seconds } from 'in-services/time/time';
import useUrlState from 'in-hooks/useUrlState';
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

function usePolicyDetailsUrlParams() {
  const [{ id, op }] = useUrlState<{ id?: string; op: 'copy' | null }>({
    bind: [policyDetailsUrlParameters.id, policyDetailsUrlParameters.op]
  });
  const isCopy = op === 'copy';
  const isCreate = !id;
  const isNew = isCreate || isCopy;
  return {
    id: id ?? null,
    isNew,
    isCopy
  };
}

function PolicyDetailsLoader() {
  const { id, isNew, isCopy } = usePolicyDetailsUrlParams();
  const actions = useActions();
  const triggers = useTriggers();
  const policy = usePolicy(id, isCopy);

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

  return (
    <PolicyDetails
      key={String(isCopy)}
      isNew={isNew}
      actions={actions.data!}
      triggers={triggers}
      policy={policy.data!}
    />
  );
}

interface SubmitPayload {
  form: PolicyForm;
  triggers: Triggers;
  actions: Action[];
}

function usePolicyFormSubmission() {
  const { createPolicyTrackerSegment, editPolicyTrackerSegment } = useSegmentTracker();
  const { id, isNew } = usePolicyDetailsUrlParams();

  return useFormSubmission<SubmitPayload, Policy>(({ form, triggers, actions }) => {
    const policy = getPolicyFromForm(form);
    const selectedAction = getPolicyActionFromActions(actions, policy)!;
    const trigger = getPolicyTriggerFromTriggers(triggers, policy);
    const trackerDetailsSegment = {
      actionName: selectedAction.name,
      actionType: selectedAction.type,
      policyName: policy.name,
      policyType: isManual(policy) && isAutomatic(policy) ? 'both' : isManual(policy) ? 'manual' : 'automatic',
      aiOriginated: isAIActionCopy(selectedAction) ? true : false,
      triggerName: trigger?.name
    };

    if (isNew) {
      createPolicyTrackerSegment(trackerDetailsSegment);

      return saveNewPolicy(policy);
    } else {
      editPolicyTrackerSegment(trackerDetailsSegment);

      return savePolicy(policy, id!);
    }
  });
}

interface PolicyDetailsProps {
  isNew: boolean;
  policy: PolicyFormEntity;
  actions: Action[];
  triggers: Triggers;
}

function PolicyDetails({ isNew, actions, triggers, policy }: PolicyDetailsProps) {
  const navigateToPolicies = useNavigateToPolicies();
  const [form, setForm] = usePolicyForm(policy, actions, triggers);

  const [submitStatus, doSubmit] = usePolicyFormSubmission();

  return (
    <Form
      form={form}
      setForm={form => setForm(form as PolicyForm)}
      onSubmit={form => {
        form = form as PolicyForm;
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
      }}
    >
      <PolicyFormHeader isNew={isNew} policy={policy} />
      <SectionLine />
      <PolicyFormBody form={form} setForm={setForm} actions={actions} triggers={triggers} />
      <PolicyFormFooter isNew={isNew} form={form} submitStatus={submitStatus} />
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
