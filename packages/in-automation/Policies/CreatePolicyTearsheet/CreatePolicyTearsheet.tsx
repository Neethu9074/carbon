/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect } from 'react';

import { Link, LoadingSkeleton } from '@instana/components';
import { CreateTearsheet } from '@instana/ibm-products';
import { Policy, Result } from '@instana/types';

import useActions from 'in-automation/ActionCatalog/useActions';
import { TriggerDetailsProps } from 'in-automation/AutomationCard/CreatePolicyButton';
import { refresh as refreshScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import { AutomationErrors } from 'in-automation/constants';
import useNavigateToPolicies from 'in-automation/navigation/hooks/useNavigateToPolicies';
import ActionConfigurationStep from 'in-automation/Policies/CreatePolicyTearsheet/ActionConfigurationStep';
import locals from 'in-automation/Policies/CreatePolicyTearsheet/CreatePolicyTearsheet.mless';
import PolicyDetailsStep from 'in-automation/Policies/CreatePolicyTearsheet/PolicyDetailsStep';
import PolicyFormContext from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import TriggerConfigurationStep from 'in-automation/Policies/CreatePolicyTearsheet/TriggerConfigurationStep';
import { PolicyForm } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/types';
import usePolicyForm from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/usePolicyForm';
import { getPolicyFromForm } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/utils';
import { refresh } from 'in-automation/Policies/usePolicies';
import usePolicy from 'in-automation/Policies/usePolicy';
import usePolicyDetailsUrlParams from 'in-automation/Policies/usePolicyDetailsUrlParams';
import useTriggers from 'in-automation/Policies/useTriggers';
import { refreshPolicy } from 'in-automation/PolicyDetails/usePolicy';
import { useSegmentTracker } from 'in-automation/tracker';
import { PolicyDialogMode } from 'in-automation/types';
import { isAIActionCopy } from 'in-automation/utils/action';
import {
  getPolicyActionFromActions,
  getPolicyTriggerFromTriggers,
  isAutomatic,
  isManual
} from 'in-automation/utils/policy';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t, Trans } from 'in-i18n';
import { seconds } from 'in-services/time/time';
import { isLoading } from 'in-services/util/result';

export interface CreatePolicyTearsheetProps {
  policyId?: string;
  actionId?: string;
  triggerDetails?: TriggerDetailsProps;
  copy?: boolean;
  isFromDashboard?: boolean;
  inEventPage?: boolean;
  open?: boolean;
  closeHandler?: () => void;
}

export default function CreatePolicyTearsheet({
  policyId,
  actionId,
  triggerDetails,
  copy = false,
  closeHandler,
  open,
  isFromDashboard = false,
  inEventPage = false
}: Readonly<CreatePolicyTearsheetProps>) {
  const { isCopy, id, isNew } = usePolicyDetailsUrlParams({ policyId, copy });

  const policy = usePolicy({ id, isCopy });
  const actions = useActions();
  const triggers = useTriggers();
  const loading = isLoading(policy, actions);
  const mode: PolicyDialogMode = isNew ? 'NEW' : 'EDIT';
  const { createPolicyTrackerSegment, editPolicyTrackerSegment } = useSegmentTracker();
  const { form, setForm, resetForm, updateForm, doSubmit, errors } = usePolicyForm(
    mode,
    policy.data!,
    actions.data!,
    triggers,
    triggerDetails,
    loading
  );
  const navigateToPolicyPolicies = useNavigateToPolicies();
  const isActionPreSelected = form.getIn(['action', 'isActionPreSelected']).value;

  const onRequestSubmit = () => {
    let payload = getPolicyFromForm(form) as Policy;

    if (mode === 'EDIT' && id) {
      payload = {
        ...payload,
        id
      };
    }
    return new Promise<void>((resolve, reject) => {
      doSubmit({
        payload,
        onSuccess: (result: Result<Policy>) => {
          resolve();
          onSuccess(mode, result, {
            isFromDashboard,
            inEventPage,
            isActionPreSelected
          });

          const policy = getPolicyFromForm(form);
          const selectedAction = getPolicyActionFromActions(actions.data!, policy);
          const trigger = getPolicyTriggerFromTriggers(triggers, policy);

          const trackerDetails = {
            actionName: selectedAction?.name,
            actionType: selectedAction?.type,
            policyName: policy.name,
            policyType: isManual(policy) && isAutomatic(policy) ? 'both' : isManual(policy) ? 'manual' : 'automatic',
            aiOriginated: isAIActionCopy(selectedAction!),
            triggerName: trigger?.name
          };

          if (mode === 'NEW') {
            createPolicyTrackerSegment(trackerDetails);
            if (inEventPage) {
              refreshScoredActions();
            } else if (!isActionPreSelected) navigateToPolicyPolicies();
          }
          if (mode === 'EDIT') {
            editPolicyTrackerSegment(trackerDetails);
          }
        },
        onError: (_result?: Result<Policy>) => {
          reject();
        }
      });
    });
  };

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

  return (
    <PolicyFormContext.Provider
      value={{
        form,
        mode,
        onChange: (path, updater) => updateForm(form.updateIn(path, updater) as PolicyForm),
        setForm,
        updateForm
      }}
    >
      <CreateTearsheet
        open={open}
        backButtonText={t('in-automation:policyCreateTearsheet.back')}
        cancelButtonText={t('in-automation:cancel')}
        description={
          <Trans
            i18nKey="in-automation:policyCreateTearsheet.description"
            components={{
              Link: (
                // @ts-expect-error
                <Link
                  external
                  linkIconType={'lib_views_external_link'}
                  href="https://www.ibm.com/docs/en/instana-observability/1.0.300?topic=actions-automation-policies"
                />
              )
            }}
          />
        }
        nextButtonText={t('in-automation:policyCreateTearsheet.next')}
        onClose={closeHandler}
        className={locals.policyTearsheet}
        onRequestSubmit={onRequestSubmit}
        // @ts-expect-error
        selectorPrimaryFocus=".c4p--tearsheet-create__step--title"
        submitButtonText={isNew ? t('forms.actions.create') : t('in-automation:actionHistory.saveButton')}
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
      >
        <TriggerConfigurationStep triggers={triggers} loading={loading} />
        <ActionConfigurationStep actions={actions.data!} />
        <PolicyDetailsStep errors={errors} />
      </CreateTearsheet>
    </PolicyFormContext.Provider>
  );
}

function onSuccess(
  mode: PolicyDialogMode,
  result: Result<Policy>,
  {
    isFromDashboard,
    inEventPage,
    isActionPreSelected
  }: { isFromDashboard: boolean; inEventPage: boolean; isActionPreSelected: boolean }
) {
  if (!result?.data) throw Error(AutomationErrors.UNEXPECTED_POLICY_CREATION_ERROR);
  const { name } = result.data;
  if (mode === 'NEW') {
    onSaveSuccess(name);
    if (!isFromDashboard && !isActionPreSelected) refresh();
  }
  if (mode === 'EDIT') {
    onEditSuccess(name);
    if (inEventPage) {
      refreshScoredActions();
    } else {
      if (isFromDashboard) {
        refreshPolicy();
      } else {
        refresh();
      }
    }
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

function onEditSuccess(name: string) {
  refresh();
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
