/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

import { LoadingSkeleton, SvgIcon } from '@instana/components';
import { Tearsheet } from '@instana/ibm-products';
import { themes } from '@instana/design-tokens';
import { Result } from '@instana/types';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { aiOriginatedMetadata, isAIAction, isAIActionCopy, isNotEditable } from 'in-automation/utils/action';
import useNavigateToActionCatalog from 'in-automation/navigation/hooks/useNavigateToActionCatalog';
import useActionDetailsUrlParams from 'in-automation/ActionCatalog/useActionDetailsUrlParams';
import { generateNavItems } from 'in-automation/ActionCatalog/useActionForm/validationUtils';
import useActionForm from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import { getActionFromForm } from 'in-automation/ActionCatalog/useActionForm/utils';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import ActionFormContext from 'in-automation/ActionCatalog/ActionFormContext';
import { ActionForm } from 'in-automation/ActionCatalog/useActionForm/types';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { ActionFormBody } from 'in-automation/ActionCatalog/ActionForm';
import { refreshAction } from 'in-automation/ActionDashboard/useAction';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import useActionFilter from 'in-automation/hooks/useActionFilter';
import { refresh } from 'in-automation/ActionCatalog/useActions';
import DescriptionText from 'in-components/form/DescriptionText';
import { productAreas } from 'in-services/tracking/productAreas';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import useAction from 'in-automation/ActionCatalog/useAction';
import { saveAction, saveNewAction } from 'in-automation/api';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { hasError, isLoading } from 'in-services/util/result';
import SectionLine from 'in-settings/components/SectionLine';
import { pageNames } from 'in-services/tracking/pageNames';
import { useSegmentTracker } from 'in-automation/tracker';
import { ActionFilter } from 'in-automation/types';
import Form from 'in-components/form/binding/Form';
import Title from 'in-components/Title/Title';
import SideNav from 'in-components/SideNav';
import { seconds } from 'in-services/time';
import { t, Trans } from 'in-i18n';

import locals from 'in-automation/ActionCatalog/CreateNewActionTearsheet.mless';

export type CreateNewActionTearsheetProps = {
  actionId?: string;
  copy?: boolean;
  isFromDashboard?: boolean;
  open?: boolean;
  closeHandler?: () => void;
};

export default function CreateNewActionTearsheet({
  actionId,
  copy = false,
  isFromDashboard = false,
  open = false,
  closeHandler
}: CreateNewActionTearsheetProps) {
  const { isCopy, id, isNew } = useActionDetailsUrlParams({ actionId, copy });
  const action = useAction({ id, isCopy });
  const actionFilter = useActionFilter();

  const [form, setForm, resetForm] = useActionForm({ action: action.data, actionFilter: actionFilter.data! || 'all' });
  const { onSubmit, result } = useOnSubmit({ actionId, copy, isFromDashboard, closeHandler });
  const actionButtons = [
    {
      kind: 'primary',
      label: isNew ? t('forms.actions.create') : t('in-automation:actionHistory.saveButton'),
      onClick: () => {
        onSubmit({ form, action: action.data, setForm });
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

  const loading = isLoading(action, actionFilter);
  const errored = hasError(action, actionFilter);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const renderContent = () => {
    if (loading) return <LoadingIndicator size={'xl'} />;
    if (errored) {
      const errors = [...action.errors, ...actionFilter.errors];
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
        <Title title={t('in-automation:ActionCatalog.action')} />
        <ActionDetailsLoader
          form={form}
          setForm={form => setForm(form as ActionForm)}
          result={result}
          copy={copy}
          actionId={actionId}
        />
      </>
    );
  };
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.automation,
          pageRootName: pageNames.automation_action_create
        }}
      />
      <isNotEditableContext.Provider value={action.data ? isNotEditable(action.data, isCopy) : false}>
        {
          // @ts-expect-error
          <Tearsheet
            open={open}
            influencer={influencerContent(form)}
            title={
              actionId && !isCopy ? (
                <div className={locals.title}>
                  {t('in-automation:ActionCatalog.configureActionEntityName', { entityName: action.data?.name })}
                  {loading ? <LoadingSkeleton className={locals.labelSkeleton} /> : null}
                </div>
              ) : (
                t('in-automation:ActionCatalog.createANewAction')
              )
            }
            actions={actionButtons}
            onClose={closeHandler}
          >
            {renderContent()}
          </Tearsheet>
        }
      </isNotEditableContext.Provider>
    </>
  );
}

const influencerContent = (form: ActionForm) => {
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

function ActionDetailsLoader({
  form,
  setForm,
  result,
  copy,
  actionId
}: {
  form: ActionForm;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
  result: Result<any> | null;
  copy: boolean;
  actionId?: string;
}) {
  const { isCopy, id } = useActionDetailsUrlParams({ actionId, copy });
  const action = useAction({ id, isCopy });
  const actionFilter = useActionFilter();

  const loading = isLoading(action, actionFilter);
  const errored = hasError(result!, actionFilter!);
  let errors = null;

  if (loading) {
    return <LoadingIndicator size={'xl'} />;
  }
  if (errored) errors = [...result!.errors, ...actionFilter.errors];

  return (
    <>
      {errored && errors !== null && <ErroneousResultPresenter errors={errors} />}
      <ActionDetails
        key={String(isCopy)}
        action={action.data}
        actionFilter={actionFilter.data!}
        form={form}
        setForm={form => setForm(form as ActionForm)}
        copy={copy}
        actionId={actionId}
      />
    </>
  );
}

interface ActionDetailsProps {
  action?: ActionFormEntity;
  actionFilter: 'all' | ActionFilter;
  form: ActionForm;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
  copy: boolean;
  actionId?: string;
}

function ActionDetails({ action, actionFilter, form, setForm, copy, actionId }: ActionDetailsProps) {
  const { isCopy } = useActionDetailsUrlParams({ copy, actionId });

  return (
    <isNotEditableContext.Provider value={action ? isNotEditable(action, isCopy) : false}>
      <ActionFormContext.Provider
        value={{
          form,
          rootPath: [],
          setForm
        }}
      >
        <Form form={form} setForm={form => setForm(form as ActionForm)} onSubmit={() => {}}>
          <ActionFormBody action={action} actionFilter={actionFilter} />
        </Form>
      </ActionFormContext.Provider>
    </isNotEditableContext.Provider>
  );
}

interface useOnSubmitProps {
  copy: boolean;
  actionId?: string;
  isFromDashboard?: boolean;
  closeHandler?: () => void;
}
function useOnSubmit({ actionId, copy, isFromDashboard, closeHandler }: useOnSubmitProps) {
  const { createActionTrackerSegment, editActionTrackerSegment } = useSegmentTracker();
  const [result, setResult] = useState<Result<any> | null>(null);
  const { isNew, isCopy, id } = useActionDetailsUrlParams({ actionId, copy });
  const navigateToActionCatalog = useNavigateToActionCatalog();
  function onSubmit({
    form,
    action,
    setForm
  }: {
    form: ActionForm;
    action?: ActionFormEntity;
    setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
  }) {
    if (!form.hierarchyValid) {
      setForm(form.setTouched(true, { recurse: true }));
      return;
    }
    const actionSpecification = getActionFromForm(form, action);
    const aiOriginated = action && (isAIAction(action) || isAIActionCopy(action)) ? true : false;
    const trackerDetails = {
      actionName: actionSpecification.name,
      actionType: actionSpecification.type,
      aiOriginated
    };
    if (isNew) {
      return saveNewAction({
        ...actionSpecification,
        metadata: aiOriginated && isCopy ? aiOriginatedMetadata : undefined
      })
        .filter(res => !isLoading(res))
        .once(
          result => {
            setResult(result);
            if (hasError(result)) return;
            createActionTrackerSegment(trackerDetails);
            onSaveSuccess(result.data?.name!);
            closeHandler?.();
            navigateToActionCatalog();
            if (!isFromDashboard) refresh();
          },
          result => {
            onSaveFailure(result?.errors);
          }
        );
    } else {
      return saveAction(actionSpecification, id!)
        .filter(res => !isLoading(res))
        .once(
          result => {
            setResult(result);
            if (hasError(result)) return;
            editActionTrackerSegment(trackerDetails);
            onEditSuccess(result.data?.name!);
            closeHandler?.();
            if (isFromDashboard) {
              refreshAction();
            } else {
              navigateToActionCatalog();
              refresh();
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
