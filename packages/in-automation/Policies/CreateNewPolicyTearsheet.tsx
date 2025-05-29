/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { createContext, useContext, useState } from 'react';

import { Tearsheet } from '@instana/ibm-products';
import { themes } from '@instana/design-tokens';
import { Action, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import {
  getPolicyActionFromActions,
  getPolicyTriggerFromTriggers,
  isAutomatic,
  isManual
} from 'in-automation/utils/policy';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { refresh as refreshScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import useNavigateToPolicies from 'in-automation/navigation/hooks/useNavigateToPolicies';
import usePolicyDetailsUrlParams from 'in-automation/Policies/usePolicyDetailsUrlParams';
import { generateNavItems } from 'in-automation/Policies/usePolicyForm/validationUtils';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import usePolicyForm from 'in-automation/Policies/usePolicyForm/usePolicyForm';
import { getPolicyFromForm } from 'in-automation/Policies/usePolicyForm/utils';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { getActions, saveNewPolicy, savePolicy } from 'in-automation/api';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { PolicyForm } from 'in-automation/Policies/usePolicyForm/types';
import { refreshPolicy } from 'in-automation/PolicyDetails/usePolicy';
import { PolicyFormBody } from 'in-automation/Policies/PolicyForm';
import DescriptionText from 'in-components/form/DescriptionText';
import { productAreas } from 'in-services/tracking/productAreas';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { PolicyFormEntity } from 'in-automation/Policies/types';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { hasError, isLoading } from 'in-services/util/result';
import { refresh } from 'in-automation/Policies/usePolicies';
import useTriggers from 'in-automation/Policies/useTriggers';
import SectionLine from 'in-settings/components/SectionLine';
import { isAIActionCopy } from 'in-automation/utils/action';
import { close } from 'in-components/DialogPresenter/store';
import { pageNames } from 'in-services/tracking/pageNames';
import { useSegmentTracker } from 'in-automation/tracker';
import usePolicy from 'in-automation/Policies/usePolicy';
import { pendingResult } from 'in-services/fixedObjects';
import Form from 'in-components/form/binding/Form';
import { seconds } from 'in-services/time/time';
import { Triggers } from 'in-automation/types';
import Title from 'in-components/Title/Title';
import SideNav from 'in-components/SideNav';
import { t, Trans } from 'in-i18n';

const cancelButton = {
  kind: 'ghost',
  label: t('in-automation:cancel'),
  onClick: () => {
    close();
  }
};

export default function CreateNewPolicyTearsheet({
  policyId,
  copy = false,
  isFromDashboard = false,
  inEventPage = false
}: {
  policyId?: string;
  copy?: boolean;
  isFromDashboard?: boolean;
  inEventPage?: boolean;
}) {
  const { isCopy, id, isNew } = usePolicyDetailsUrlParams({ policyId, copy });
  const policy = usePolicy({ id, isCopy });
  const actions = useActions();
  const triggers = useTriggers();

  const loading = isLoading(policy, actions, ...Object.values(triggers));
  const errored = hasError(policy, actions);

  const policyButtons = [
    {
      kind: 'primary',
      label: isNew ? t('forms.actions.create') : t('in-automation:actionHistory.saveButton'),
      onClick: () => {}
    } as any,
    cancelButton
  ];

  if (loading) {
    return (
      // @ts-expect-error
      <Tearsheet
        open
        influencer={influencerContent()}
        title={
          policyId && !isCopy
            ? t('in-automation:policies.configurePolicyEntityName')
            : t('in-automation:policies.createANewPolicy')
        }
        actions={policyButtons}
      >
        <LoadingIndicator size={'xl'} />
      </Tearsheet>
    );
  }

  if (errored) {
    const errors = [...policy.errors, ...actions.errors];
    return (
      // @ts-expect-error
      <Tearsheet open>
        <SettingsDetailPage>
          <SubViewHeader
            iconType="lib_help_error_error_circle"
            iconColor={themes.default.ids.color.option.yellow['500']}
          >
            {t('in-automation:ActionCatalog.unknownAction')}
          </SubViewHeader>
          <SectionLine />
          <DescriptionText>
            <ErroneousResultPresenter errors={errors} />
            <br />
            {t('in-automation:ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
          </DescriptionText>
        </SettingsDetailPage>
      </Tearsheet>
    );
  }

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.automation,
          pageRootName: pageNames.automation_policy_create
        }}
      />
      <TearSheetLoader
        key={String(isCopy)}
        actions={actions.data!}
        copy={copy}
        policyId={policyId}
        policy={policy.data!}
        triggers={triggers}
        inEventPage={inEventPage}
        isFromDashboard={isFromDashboard}
      />
    </>
  );
}

interface TearSheetProps {
  copy: boolean;
  policyId?: string;
  policy: PolicyFormEntity;
  actions: Action[];
  triggers: Triggers;
  isFromDashboard?: boolean;
  inEventPage: boolean;
}

function TearSheetLoader({ actions, copy, policy, policyId, triggers, isFromDashboard, inEventPage }: TearSheetProps) {
  const { isCopy, isNew } = usePolicyDetailsUrlParams({ policyId, copy });
  const [form, setForm] = usePolicyForm(policy, actions, triggers);
  const { onSubmit, result } = useOnSubmit({ policyId, copy, actions, triggers, isFromDashboard, inEventPage });
  const policyButtons = [
    {
      kind: 'primary',
      label: isNew ? t('forms.actions.create') : t('in-automation:actionHistory.saveButton'),
      onClick: () => {
        onSubmit({ form, setForm });
      }
    } as any,
    cancelButton
  ];

  return (
    <>
      {/* @ts-expect-error */}
      <Tearsheet
        open
        influencer={influencerContent(form)}
        title={
          policyId && !isCopy
            ? t('in-automation:policies.configurePolicyEntityName', { entityName: policy?.name })
            : t('in-automation:policies.createANewPolicy')
        }
        actions={policyButtons}
      >
        <>
          <Title title={t('in-automation:policies.policy')} />
          <PolicyDetailsLoader
            form={form}
            setForm={form => setForm(form as PolicyForm)}
            actions={actions}
            triggers={triggers}
            result={result}
            copy={copy}
            inEventPage={inEventPage}
          />
        </>
      </Tearsheet>
    </>
  );
}

const influencerContent = (form?: PolicyForm) => {
  return (
    <SideNav
      navItems={generateNavItems(form)}
      renderPostIcon={({ valid }) => {
        if (valid) return null;
        return (
          <SvgIcon type="lib_help_error_error_circle" size="xs" color={themes.default.ids.color.option.red['500']} />
        );
      }}
    />
  );
};

export const isNotEditableContext = createContext(false);

export function useIsNotEditableContext() {
  return useContext(isNotEditableContext);
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

function PolicyDetailsLoader({
  form,
  setForm,
  actions,
  triggers,
  result,
  copy,
  inEventPage
}: Readonly<{
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
  actions: Action[];
  triggers: Triggers;
  result: Result<any> | null;
  copy: boolean;
  inEventPage: boolean;
}>) {
  const errored = hasError(result!);
  const errors = errored ? result!.errors : null;
  return (
    <>
      {errors && (
        <LeftRightPadding>
          <ErroneousResultPresenter errors={errors} />
        </LeftRightPadding>
      )}
      <PolicyDetails
        key={String(copy)}
        actions={actions}
        triggers={triggers}
        form={form}
        setForm={form => setForm(form as PolicyForm)}
        inEventPage={inEventPage}
      />
    </>
  );
}

interface PolicyDetailsProps {
  actions: Action[];
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
  triggers: Triggers;
  inEventPage: boolean;
}

function PolicyDetails({ actions, form, setForm, triggers, inEventPage }: PolicyDetailsProps) {
  return (
    <Form form={form} setForm={form => setForm(form as PolicyForm)} onSubmit={() => {}}>
      <PolicyFormBody actions={actions} triggers={triggers} inEventPage={inEventPage} />
    </Form>
  );
}

interface useOnSubmitProps {
  copy: boolean;
  policyId?: string;
  actions: Action[];
  triggers: Triggers;
  isFromDashboard?: boolean;
  inEventPage: boolean;
}
function useOnSubmit({ policyId, copy, actions, triggers, isFromDashboard, inEventPage }: useOnSubmitProps) {
  const { createPolicyTrackerSegment, editPolicyTrackerSegment } = useSegmentTracker();
  const [result, setResult] = useState<Result<any> | null>(null);
  const { isNew, id } = usePolicyDetailsUrlParams({ policyId, copy });
  const navigateToPolicyPolicies = useNavigateToPolicies();
  function onSubmit({
    form,
    setForm
  }: {
    form: PolicyForm;
    setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
  }) {
    if (!form.hierarchyValid) {
      setForm(form.setTouched(true, { recurse: true }));
      return;
    }
    const policy = getPolicyFromForm(form);
    const selectedAction = getPolicyActionFromActions(actions, policy)!;
    const trigger = getPolicyTriggerFromTriggers(triggers, policy);

    const trackerDetails = {
      actionName: selectedAction.name,
      actionType: selectedAction.type,
      policyName: policy.name,
      policyType: isManual(policy) && isAutomatic(policy) ? 'both' : isManual(policy) ? 'manual' : 'automatic',
      aiOriginated: isAIActionCopy(selectedAction) ? true : false,
      triggerName: trigger?.name
    };
    if (isNew) {
      return saveNewPolicy(policy)
        .filter(res => !isLoading(res))
        .once(
          result => {
            setResult(result);
            if (hasError(result)) return;
            createPolicyTrackerSegment(trackerDetails);
            onSaveSuccess(result.data?.name!);
            close();
            navigateToPolicyPolicies();
            if (!isFromDashboard) refresh();
          },
          result => {
            onSaveFailure(result?.errors);
          }
        );
    } else {
      return savePolicy(policy, id!)
        .filter(res => !isLoading(res))
        .once(
          result => {
            setResult(result);
            if (hasError(result)) return;
            editPolicyTrackerSegment(trackerDetails);
            onEditSuccess(result.data?.name!);
            close();
            if (inEventPage) {
              refreshScoredActions();
            } else {
              if (isFromDashboard) {
                refreshPolicy();
              } else {
                navigateToPolicyPolicies();
                refresh();
              }
            }
          },
          result => {
            onEditFailure(result?.errors);
          }
        );
    }
  }
  return {
    onSubmit,
    result
  };
}

function useActions() {
  return useObservable(getActions, []) ?? (pendingResult as Result<Action[]>);
}
