/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { PolicyFormBody, PolicyFormFooter, PolicyFormHeader } from 'in-automation/Policies/PolicyForm';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { PolicyForm, Triggers, isAutomatic, isManual } from 'in-automation/Policies/types';
import usePolicyForm, { getPolicyFromForm } from 'in-automation/Policies/usePolicyForm';
import { policyDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import { getAllActionsResult, saveNewPolicy, savePolicy } from 'in-automation/api';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import useNavigateToPolicies from 'in-automation/Policies/useNavigateToPolicies';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { createPolicyTracker, editPolicyTracker } from 'in-automation/tracker';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import useFormSubmission from 'in-service-levels/hooks/useFormSubmission';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { all as allStatus } from 'in-hooks/utils/fetchStatus';
import SectionLine from 'in-settings/components/SectionLine';
import useTriggers from 'in-automation/Policies/useTriggers';
import usePolicy from 'in-automation/Policies/usePolicy';
import Form from 'in-components/form/binding/Form';
import { seconds } from 'in-services/time/time';
import useUrlState from 'in-hooks/useUrlState';
import Title from 'in-components/Title/Title';
import { Action, Policy } from 'in-types';
import { t } from 'in-i18n';

import locals from './Policy.mless';

type SubmitPayload = {
  form: PolicyForm;
  id: string | undefined;
  isNew: boolean;
  triggers: Triggers | undefined;
  actions: Action[] | undefined;
};

function useActions() {
  return resultToFetchedStateResponse(useObservable(getAllActionsResult, []));
}

function usePolicyDetailsUrlParams() {
  const [{ policyId, op }] = useUrlState<{ policyId?: string; op: 'copy' | null }>({
    bind: [policyDetailsUrlParameters.policyId, policyDetailsUrlParameters.op]
  });
  const isCopy = op === 'copy';
  const isCreate = !policyId;
  const isNew = isCreate || isCopy;
  return {
    policyId,
    isNew,
    isCopy
  };
}

export default function PolicyDetails() {
  const { policyId, isNew, isCopy } = usePolicyDetailsUrlParams();
  const [actions, actionsStatus, actionsErrors] = useActions();
  const [triggers, triggersStatus, triggersErrors] = useTriggers();
  const [policy, policyStatus, policyErrors] = usePolicy(policyId, isCopy);

  const status = allStatus(policyStatus, triggersStatus, actionsStatus);
  const errors = [...policyErrors, ...triggersErrors, ...actionsErrors];

  const [form, setForm] = usePolicyForm(policy, actions, triggers);
  const navigateToPolicies = useNavigateToPolicies();

  const [submitStatus, doSubmit] = useFormSubmission<SubmitPayload, Policy>(({ form, id, isNew }) =>
    save(form, id, isNew, triggers, actions)
  );

  let content: JSX.Element;
  if (status === 'rejected') {
    content = (
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
  } else if (status === 'pending' || !form) {
    content = <LoadingIndicator />;
  } else {
    content = (
      <div className={locals.actionBody}>
        <SettingsDetailPage>
          <PolicyFormHeader isNew={isNew} policy={policy!} />
          <SectionLine />
          <PolicyFormBody form={form!} setForm={setForm} actions={actions!} triggers={triggers!} />
          <PolicyFormFooter isNew={isNew} form={form!} submitStatus={submitStatus} />
        </SettingsDetailPage>
      </div>
    );
  }

  return (
    <>
      <Title title={t('in-automation:policies.policy')} />
      <Form
        form={form!}
        setForm={form => setForm(form as PolicyForm)}
        onSubmit={form => {
          const name = (form as PolicyForm).get('name').value;
          doSubmit({
            payload: { form: form as PolicyForm, id: policyId, isNew, triggers, actions },
            onError: () => onSaveFailure(name),
            onSuccess: () => {
              onSaveSuccess(name);
              navigateToPolicies();
            }
          });
        }}
      >
        {content}
      </Form>
    </>
  );
}

function save(
  form: PolicyForm,
  id: string | undefined,
  isNew: boolean,
  triggers: Triggers | undefined,
  actions: Action[] | undefined
) {
  const policy = getPolicyFromForm(form);
  const trackerDetails = {
    name: policy.name,
    // @ts-expect-error
    triggerName: triggers?.[policy.trigger.type].find(({ id }) => id === policy.trigger.id)?.name,
    actionName: actions?.find(
      ({ id }) => id === policy.typeConfigurations[0].runnable.runConfiguration.actions[0].action.id
    )?.name,
    type: isManual(policy) && isAutomatic(policy) ? 'both' : isManual(policy) ? 'manual' : 'automatic'
  };
  if (isNew) {
    createPolicyTracker(trackerDetails);
    return saveNewPolicy(policy);
  } else {
    editPolicyTracker(trackerDetails);
    return savePolicy(policy, id!);
  }
}

function onSaveSuccess(name: string) {
  addMessage(
    {
      type: 'info',
      timeout: seconds.toMillis(4),
      title: t('in-automation:policies.onSaveSuccessTitle'),
      content: t('in-automation:policies.onSaveSuccessContent', {
        name
      })
    },
    'policy-save-success'
  );
}

function onSaveFailure(name: string) {
  addMessage(
    {
      type: 'danger',
      timeout: seconds.toMillis(6),
      title: t('in-automation:policies.onSaveFailedTitle'),
      content: t('in-automation:policies.onSaveFailedContent', {
        name
      })
    },
    'policy-save-failure'
  );
}
