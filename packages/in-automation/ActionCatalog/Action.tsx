/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field as FormField } from 'formalistic';
import React, { createContext } from 'react';

import { themes } from '@instana/design-tokens';
import { Action, Error } from '@instana/types';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { aiOriginatedMetadata, isAIAction, isAIActionCopy, isNotEditable } from 'in-automation/utils/action';
import { ActionFormBody, ActionFormFooter, ActionFormHeader } from 'in-automation/ActionCatalog/ActionForm';
import useActionForm, { ActionForm, getActionFromForm } from 'in-automation/ActionCatalog/useActionForm';
import useNavigateToActionCatalog from 'in-automation/navigation/hooks/useNavigateToActionCatalog';
import { actionDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { setViewTrackingDataValues } from 'in-components/ViewTrackingMeta';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import useActionFilter from 'in-automation/hooks/useActionFilter';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import { productAreas } from 'in-services/tracking/productAreas';
import { saveAction, saveNewAction } from 'in-automation/api';
import useAction from 'in-automation/ActionCatalog/useAction';
import { hasError, isLoading } from 'in-services/util/result';
import SectionLine from 'in-settings/components/SectionLine';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { pageNames } from 'in-services/tracking/pageNames';
import { useSegmentTracker } from 'in-automation/tracker';
import Form from 'in-components/form/binding/Form';
import { ActionFilter } from 'in-automation/types';
import useUrlState from 'in-hooks/useUrlState';
import Title from 'in-components/Title/Title';
import { seconds } from 'in-services/time';
import { Trans, t } from 'in-i18n';

export const isNotEditableContext = createContext(false);

function useActionDetailsUrlParams() {
  const [{ id, op }] = useUrlState<{ id?: string; op: 'copy' | null }>({
    bind: [actionDetailsUrlParameters.id, actionDetailsUrlParameters.op]
  });
  const isCopy = op === 'copy';
  const isCreate = !id;
  const isNew = isCreate || isCopy;
  return {
    id: id ?? null,
    isNew,
    isCreate,
    isCopy
  };
}

export default function ActionDetailsWrapper() {
  // Set values for tracking data
  setViewTrackingDataValues(productAreas.automation, pageNames.automation_action_catalog);

  return (
    <>
      <Title title={t('in-automation:ActionCatalog.action')} />
      <ActionDetailsLoader />
    </>
  );
}
function ActionDetailsLoader() {
  const { id, isNew, isCreate, isCopy } = useActionDetailsUrlParams();
  const action = useAction(id, isCopy);
  const actionFilter = useActionFilter();

  const loading = isLoading(action, actionFilter);
  const errored = hasError(action, actionFilter);

  if (loading) {
    return <LoadingIndicator size={'xl'} />;
  }

  if (errored) {
    const errors = [...action.errors, ...actionFilter.errors];
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={themes.default.ids.color.option.yellow['500']}>
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
    <ActionDetails
      key={String(isCopy)}
      isNew={isNew}
      isCreate={isCreate}
      isCopy={isCopy}
      action={action.data!}
      actionFilter={actionFilter.data!}
    />
  );
}

export type OnChange = <VALUETYPE>(
  fieldName: string | ((mapForm: ActionForm) => ActionForm),
  value: VALUETYPE,
  updateFormDefinition?: (mapForm: ActionForm, action: ActionFormEntity) => ActionForm
) => ActionForm;

interface SubmitPayload {
  form: ActionForm;
  action: ActionFormEntity;
}

function useActionFormSubmission() {
  const { createActionTrackerSegment, editActionTrackerSegment } = useSegmentTracker();
  const { id, isNew, isCopy } = useActionDetailsUrlParams();

  return useFormSubmission<SubmitPayload, Action>(({ form, action }) => {
    const actionSpecification = getActionFromForm(form, action);
    const aiOriginated = isAIAction(action) || isAIActionCopy(action);
    if (isNew) {
      createActionTrackerSegment({
        actionName: actionSpecification.name,
        actionType: actionSpecification.type,
        aiOriginated: aiOriginated ? true : false
      });

      // we also want to add aiOriginated: true true to ai generated copy actions chidren and grand chidren too.
      if (aiOriginated && isCopy) {
        // add aiOriginated flag to indicates that these are copied from OOTB AI action.
        const updatedCopiedAIAction = {
          metadata: aiOriginatedMetadata,
          ...actionSpecification
        };
        return saveNewAction(updatedCopiedAIAction);
      }
      return saveNewAction(actionSpecification);
    } else {
      editActionTrackerSegment({
        actionName: actionSpecification.name,
        actionType: actionSpecification.type,
        aiOriginated: aiOriginated ? true : false
      });

      return saveAction(actionSpecification, id!);
    }
  });
}

interface ActionDetailsProps {
  isNew: boolean;
  isCreate: boolean;
  isCopy: boolean;
  action: ActionFormEntity;
  actionFilter: 'all' | ActionFilter;
}
function ActionDetails({ isNew, isCreate, isCopy, action, actionFilter }: ActionDetailsProps) {
  const navigateToActionCatalog = useNavigateToActionCatalog();
  const [form, setForm] = useActionForm(action, actionFilter);

  const [submitStatus, doSubmit] = useActionFormSubmission();
  const onChange: OnChange = (fieldName, value, updateFormDefinition) => {
    let updatedForm = form;

    if (typeof fieldName === 'function') {
      const updater = fieldName;
      updatedForm = updater(updatedForm);

      setForm(updatedForm);

      return updatedForm;
    }

    updatedForm = updatedForm.updateIn([fieldName], field =>
      (field as FormField<typeof value>).setValue(value).setTouched(true)
    );

    if (updateFormDefinition) {
      updatedForm = updateFormDefinition(updatedForm, action);
    }

    setForm(updatedForm);

    return updatedForm;
  };

  return (
    <isNotEditableContext.Provider value={isNotEditable(action, isCopy)}>
      <Form
        form={form}
        setForm={form => setForm(form as ActionForm)}
        onSubmit={form => {
          form = form as ActionForm;
          const name = form.get('name').value;
          doSubmit({
            payload: { form, action },
            onError: res => {
              if (isNew) onSaveFailure(res?.errors);
              else onEditFailure(res?.errors);
            },
            onSuccess: () => {
              if (isNew) onSaveSuccess(name);
              else onEditSuccess(name);
              navigateToActionCatalog();
            }
          });
        }}
      >
        <ActionFormHeader isNew={isNew} action={action} />
        <SectionLine />
        <ActionFormBody
          isCreate={isCreate}
          form={form}
          onChange={onChange}
          action={action}
          setForm={setForm}
          actionFilter={actionFilter}
        />
        <ActionFormFooter isNew={isNew} form={form} submitStatus={submitStatus} action={action} isCopy={isCopy} />
      </Form>
    </isNotEditableContext.Provider>
  );
}

function onSaveSuccess(name: string) {
  addMessage(
    {
      type: 'info',
      timeout: seconds.toMillis(4),
      title: t('in-automation:ActionCatalog.createDialog.success.title'),
      content: t('in-automation:ActionCatalog.createDialog.success.content', {
        name
      })
    },
    'action-save-success'
  );
}

function onSaveFailure(errors: Error[] | undefined) {
  if (errors) {
    errors.forEach(error =>
      addMessage(
        {
          type: 'danger',
          timeout: seconds.toMillis(6),
          title: t('in-automation:ActionCatalog.createDialog.failure.title'),
          content: (
            <Trans
              i18nKey="in-automation:ActionCatalog.createDialog.failure.content"
              values={{ errorMessage: error.message }}
            />
          )
        },
        'action-save-failure'
      )
    );
  } else {
    addMessage(
      {
        type: 'danger',
        timeout: seconds.toMillis(6),
        title: t('in-automation:ActionCatalog.createDialog.failure.title'),
        content: (
          <Trans
            i18nKey="in-automation:ActionCatalog.createDialog.failure.content"
            values={{ errorMessage: t('in-components:error.erroneousResultPresenterMessage') }}
          />
        )
      },
      'action-save-failure'
    );
  }
}

function onEditSuccess(name: string) {
  addMessage(
    {
      type: 'info',
      timeout: seconds.toMillis(4),
      title: t('in-automation:ActionCatalog.editDialog.success.title'),
      content: t('in-automation:ActionCatalog.editDialog.success.content', {
        name
      })
    },
    'action-edit-success'
  );
}

function onEditFailure(errors: Error[] | undefined) {
  if (errors) {
    errors.forEach(error =>
      addMessage(
        {
          type: 'danger',
          timeout: seconds.toMillis(6),
          title: t('in-automation:ActionCatalog.editDialog.failure.title'),
          content: (
            <Trans
              i18nKey="in-automation:ActionCatalog.editDialog.failure.content"
              values={{ errorMessage: error.message }}
            />
          )
        },
        'action-edit-failure'
      )
    );
  } else {
    addMessage(
      {
        type: 'danger',
        timeout: seconds.toMillis(6),
        title: t('in-automation:ActionCatalog.editDialog.failure.title'),
        content: (
          <Trans
            i18nKey="in-automation:ActionCatalog.editDialog.failure.content"
            values={{ errorMessage: t('in-components:error.erroneousResultPresenterMessage') }}
          />
        )
      },
      'action-edit-failure'
    );
  }
}
