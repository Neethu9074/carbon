/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

import { LoadingSkeleton, SvgIcon } from '@instana/components';
import { Tearsheet } from '@instana/ibm-products';
import { themes } from '@instana/design-tokens';
import { Action, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

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
import { TriggerDetailsProps } from 'in-automation/AutomationCard/CreatePolicyButton';
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
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { hasError, isLoading } from 'in-services/util/result';
import { refresh } from 'in-automation/Policies/usePolicies';
import useTriggers from 'in-automation/Policies/useTriggers';
import SectionLine from 'in-settings/components/SectionLine';
import { isAIActionCopy } from 'in-automation/utils/action';
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

import locals from 'in-automation/ActionCatalog/CreateNewActionTearsheet.mless';

export interface CreateNewPolicyTearsheetProps {
  policyId?: string;
  actionId?: string;
  triggerDetails?: TriggerDetailsProps;
  copy?: boolean;
  isFromDashboard?: boolean;
  inEventPage?: boolean;
  open?: boolean;
  closeHandler?: () => void;
}

export default function CreateNewPolicyTearsheet({
  policyId,
  actionId,
  triggerDetails,
  copy = false,
  isFromDashboard = false,
  inEventPage = false,
  closeHandler,
  open
}: Readonly<CreateNewPolicyTearsheetProps>) {
  const { isCopy, id, isNew } = usePolicyDetailsUrlParams({ policyId, copy });

  const policy = usePolicy({ id, isCopy });
  const actions = useActions();
  const triggers = useTriggers();
  const loading = isLoading(policy, actions, ...Object.values(triggers));
  const errored = hasError(policy, actions);
  const [form, setForm, resetForm] = usePolicyForm(policy.data!, actions.data!, triggers, triggerDetails, loading);
  const { onSubmit, result } = useOnSubmit({
    policyId,
    copy,
    actions: actions.data!,
    triggers,
    isFromDashboard,
    inEventPage,
    closeHandler
  });

  const policyButtons = [
    {
      kind: 'primary',
      label: isNew ? t('forms.actions.create') : t('in-automation:actionHistory.saveButton'),
      onClick: () => {
        onSubmit({ form, setForm });
      }
    } as any,
    {
      kind: 'ghost',
      label: t('in-automation:cancel'),
      onClick: () => {
        closeHandler?.();
      }
    }
  ];

  useEffect(() => {
    if (actionId) {
      setForm(form => form.updateIn(['action', 'actionId'], item => item.setValue(actionId as string)));
      setForm(form => form.updateIn(['action', 'isActionPreSelected'], item => item.setValue(true)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionId]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const renderContent = () => {
    if (loading) return <LoadingIndicator size={'xl'} />;
    if (errored) {
      const errors = [...policy.errors, ...actions.errors];
      return (
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
      );
    }

    return (
      <>
        <Title title={t('in-automation:policies.policy')} />
        <PolicyDetailsLoader
          form={form}
          setForm={form => setForm(form as PolicyForm)}
          actions={actions.data!}
          triggers={triggers}
          result={result}
          inEventPage={inEventPage}
        />
      </>
    );
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.automation,
          pageRootName: pageNames.automation_policy_create
        }}
      />
      {/* @ts-expect-error */}
      <Tearsheet
        open={open}
        influencer={influencerContent(form)}
        title={
          policyId && !isCopy ? (
            <div className={locals.title}>
              {t('in-automation:policies.configurePolicyEntityName', { entityName: policy.data?.name })}
              {policy.progress.loading ? <LoadingSkeleton className={locals.labelSkeleton} /> : null}
            </div>
          ) : (
            t('in-automation:policies.createANewPolicy')
          )
        }
        actions={policyButtons}
        onClose={closeHandler}
      >
        {renderContent()}
      </Tearsheet>
    </>
  );
}

function PolicyDetailsLoader({
  form,
  setForm,
  actions,
  triggers,
  result,
  inEventPage
}: {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
  actions: Action[];
  triggers: Triggers;
  result: Result<any> | null;
  inEventPage: boolean;
}) {
  const errored = hasError(result!);
  const errors = errored ? result!.errors : null;
  return (
    <>
      {errors && (
        <LeftRightPadding>
          <ErroneousResultPresenter errors={errors} />
        </LeftRightPadding>
      )}

      <Form form={form} setForm={form => setForm(form as PolicyForm)} onSubmit={() => {}}>
        <PolicyFormBody actions={actions} triggers={triggers} inEventPage={inEventPage} />
      </Form>
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

interface useOnSubmitProps {
  copy: boolean;
  policyId?: string;
  actions: Action[];
  triggers: Triggers;
  isFromDashboard?: boolean;
  inEventPage: boolean;
  closeHandler?: () => void;
}
function useOnSubmit({
  policyId,
  copy,
  actions,
  triggers,
  isFromDashboard,
  inEventPage,
  closeHandler
}: useOnSubmitProps) {
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
    const isActionPreSelected = form.getIn(['action', 'isActionPreSelected']).value;

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
            closeHandler?.();
            if (inEventPage) {
              refreshScoredActions();
            } else if (!isActionPreSelected) navigateToPolicyPolicies();
            if (!isFromDashboard && !isActionPreSelected) refresh();
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
            closeHandler?.();
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
