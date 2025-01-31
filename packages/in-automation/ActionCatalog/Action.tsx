/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { createContext, useContext } from 'react';

import { themes } from '@instana/design-tokens';
import { Error } from '@instana/types';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { ActionFormBody, ActionFormFooter, ActionFormHeader } from 'in-automation/ActionCatalog/ActionForm';
import useNavigateToActionCatalog from 'in-automation/navigation/hooks/useNavigateToActionCatalog';
import useActionDetailsUrlParams from 'in-automation/ActionCatalog/useActionDetailsUrlParams';
import useActionFormSubmission from 'in-automation/ActionCatalog/useActionFormSubmission';
import useActionForm from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { ActionForm } from 'in-automation/ActionCatalog/useActionForm/types';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import useActionFilter from 'in-automation/hooks/useActionFilter';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import useAction from 'in-automation/ActionCatalog/useAction';
import { hasError, isLoading } from 'in-services/util/result';
import SectionLine from 'in-settings/components/SectionLine';
import { isNotEditable } from 'in-automation/utils/action';
import { pageNames } from 'in-services/tracking/pageNames';
import { ActionFilter } from 'in-automation/types';
import Form from 'in-components/form/binding/Form';
import Title from 'in-components/Title/Title';
import { seconds } from 'in-services/time';
import { Trans, t } from 'in-i18n';

export default function ActionDetailsWrapper() {
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.automation,
          pageRootName: pageNames.automation_action_view
        }}
      />
      <Title title={t('in-automation:ActionCatalog.action')} />
      <ActionDetailsLoader />
    </>
  );
}

function ActionDetailsLoader() {
  const { isCopy, id } = useActionDetailsUrlParams();
  const action = useAction({ id, isCopy });
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

  return <ActionDetails key={String(isCopy)} action={action.data} actionFilter={actionFilter.data!} />;
}

const isNotEditableContext = createContext(false);

export function useIsNotEditableContext() {
  return useContext(isNotEditableContext);
}

interface ActionDetailsProps {
  action?: ActionFormEntity;
  actionFilter: 'all' | ActionFilter;
}

function ActionDetails({ action, actionFilter }: ActionDetailsProps) {
  const navigateToActionCatalog = useNavigateToActionCatalog();
  const { isNew, isCopy } = useActionDetailsUrlParams();
  const [form, setForm] = useActionForm({ action, actionFilter });

  const [submitStatus, doSubmit] = useActionFormSubmission();

  function onSubmit(form: ActionForm) {
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
  }

  return (
    <isNotEditableContext.Provider value={action ? isNotEditable(action, isCopy) : false}>
      <Form form={form} setForm={form => setForm(form as ActionForm)} onSubmit={form => onSubmit(form as ActionForm)}>
        <ActionFormHeader action={action} />
        <SectionLine />
        <ActionFormBody action={action} actionFilter={actionFilter} />
        <ActionFormFooter submitStatus={submitStatus} action={action} />
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
