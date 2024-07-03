/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import { createPolicyTracker, editPolicyTracker, createPolicyFromAIActionTracker } from 'in-automation/tracker';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { PolicyFormBody, PolicyFormFooter, PolicyFormHeader } from 'in-automation/Policies/PolicyForm';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { PolicyForm, Triggers, isAutomatic, isManual } from 'in-automation/Policies/types';
import usePolicyForm, { getPolicyFromForm } from 'in-automation/Policies/usePolicyForm';
import { policyDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import useNavigateToPolicies from 'in-automation/Policies/useNavigateToPolicies';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { getActions, saveNewPolicy, savePolicy } from 'in-automation/api';
import useFormSubmission from 'in-service-levels/hooks/useFormSubmission';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { isAIActionCopy } from 'in-automation/ActionCatalog/shared';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { all as allStatus } from 'in-hooks/utils/fetchStatus';
import SectionLine from 'in-settings/components/SectionLine';
import useTriggers from 'in-automation/Policies/useTriggers';
import usePolicy from 'in-automation/Policies/usePolicy';
import Form from 'in-components/form/binding/Form';
import { Action, Error, Policy } from 'in-types';
import { seconds } from 'in-services/time/time';
import useUrlState from 'in-hooks/useUrlState';
import Title from 'in-components/Title/Title';
import { Trans, t } from 'in-i18n';

import locals from './Policy.mless';

type SubmitPayload = {
  form: PolicyForm;
  id: string | null;
  isNew: boolean;
  triggers: Triggers | undefined;
  actions: Action[] | undefined;
};

function useActions() {
  return resultToFetchedStateResponse(useObservable(getActions, []));
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

interface PolicyDetailsProps {
  id: string | null;
  isNew: boolean;
  isCopy: boolean;
}

export default function PolicyDetailsWrapper() {
  const { id, isNew, isCopy } = usePolicyDetailsUrlParams();
  return <PolicyDetails key={String(isCopy)} id={id} isNew={isNew} isCopy={isCopy} />;
}

function PolicyDetails({ id, isNew, isCopy }: PolicyDetailsProps) {
  const [actions, actionsStatus, actionsErrors] = useActions();
  const triggers = useTriggers();
  const [policy, policyStatus, policyErrors] = usePolicy(id, isCopy);

  const status = allStatus(policyStatus, actionsStatus);
  const errors = [...policyErrors, ...actionsErrors];

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
            payload: { form: form as PolicyForm, id, isNew, triggers, actions },
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
        {content}
      </Form>
    </>
  );
}

function save(
  form: PolicyForm,
  id: string | null,
  isNew: boolean,
  triggers: Triggers | undefined,
  actions: Action[] | undefined
) {
  const policy = getPolicyFromForm(form);
  // this is to findout if action is copied from ai generated action
  const selectedAction = actions?.find(
    action => action.id === policy.typeConfigurations[0].runnable.runConfiguration.actions[0].action.id
  );

  const trackerDetails = {
    name: policy.name,
    // @ts-expect-error
    triggerName: triggers?.[policy.trigger.type]?.data.find(({ id }) => id === policy.trigger.id)?.name,
    actionName: actions?.find(
      ({ id }) => id === policy.typeConfigurations[0].runnable.runConfiguration.actions[0].action.id
    )?.name,
    type: isManual(policy) && isAutomatic(policy) ? 'both' : isManual(policy) ? 'manual' : 'automatic'
  };
  if (isNew) {
    if (isAIActionCopy(selectedAction!)) {
      createPolicyFromAIActionTracker({
        fromRecommendedActioncard: false,
        ...trackerDetails
      });
    } else {
      createPolicyTracker(trackerDetails);
    }
    return saveNewPolicy(policy);
  } else {
    if (isAIActionCopy(selectedAction!)) {
      createPolicyFromAIActionTracker({
        fromRecommendedActioncard: false,
        ...trackerDetails
      });
    } else {
      editPolicyTracker(trackerDetails);
    }
    return savePolicy(policy, id!);
  }
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
