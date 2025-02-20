/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { createContext, useContext, useState } from 'react';

import { Tearsheet } from '@instana/ibm-products';
import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';
import { Result } from '@instana/types';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import useNavigateToActionCatalog from 'in-automation/navigation/hooks/useNavigateToActionCatalog';
import useActionDetailsUrlParams1 from 'in-automation/ActionCatalog/useActionDetailsUrlParams1';
import { aiOriginatedMetadata, isAIAction, isAIActionCopy } from 'in-automation/utils/action';
import { generateNavItems } from 'in-automation/ActionCatalog/useActionForm/validationUtils';
import useActionForm from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import { getActionFromForm } from 'in-automation/ActionCatalog/useActionForm/utils';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import ActionFormContext from 'in-automation/ActionCatalog/ActionFormContext';
import { ActionForm } from 'in-automation/ActionCatalog/useActionForm/types';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { ActionFormBody } from 'in-automation/ActionCatalog/ActionForm';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import useActionFilter from 'in-automation/hooks/useActionFilter';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import { refresh } from 'in-automation/ActionCatalog/useActions';
import useAction from 'in-automation/ActionCatalog/useAction';
import { hasError, isLoading } from 'in-services/util/result';
import { saveAction, saveNewAction } from 'in-automation/api';
import SectionLine from 'in-settings/components/SectionLine';
import { close } from 'in-components/DialogPresenter/store';
import { isNotEditable } from 'in-automation/utils/action';
import { useSegmentTracker } from 'in-automation/tracker';
import Form from 'in-components/form/binding/Form';
import { ActionFilter } from 'in-automation/types';
import Title from 'in-components/Title/Title';
import SideNav from 'in-components/SideNav';
import { seconds } from 'in-services/time';
import { t, Trans } from 'in-i18n';

export default function CreateNewActionTearsheet({ actionId, copy = false }: { actionId?: string; copy?: boolean }) {
  const { isCopy, id } = useActionDetailsUrlParams1({ actionId, copy });
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
    <TearSheetLoader
      key={String(isCopy)}
      action={action.data}
      actionFilter={actionFilter.data!}
      copy={copy}
      actionId={actionId}
    />
  );
}

interface TearSheetProps {
  action?: ActionFormEntity;
  actionFilter: 'all' | ActionFilter;
  copy: boolean;
  actionId?: string;
}

function TearSheetLoader({ action, actionFilter, copy, actionId }: TearSheetProps) {
  const { isCopy } = useActionDetailsUrlParams1({ copy });
  const [form, setForm] = useActionForm({ action, actionFilter });
  const { onSubmit, result } = useOnSubmit({ actionId, copy });

  const actionButtons = [
    {
      kind: 'primary',
      label: t('in-automation:actionHistory.saveButton'),
      onClick: () => {
        onSubmit({ form, setForm });
      }
    } as any,
    {
      kind: 'ghost',
      label: t('in-automation:cancel'),
      onClick: () => {
        close();
      }
    }
  ];

  return (
    <isNotEditableContext.Provider value={action ? isNotEditable(action, isCopy) : false}>
      {/* @ts-expect-error */}
      <Tearsheet
        open
        influencer={influencerContent(form)}
        title={
          actionId && !isCopy
            ? t('in-automation:ActionCatalog.configureActionEntityName', { entityName: action?.name })
            : t('in-automation:ActionCatalog.createANewAction')
        }
        actions={actionButtons}
      >
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
      </Tearsheet>
    </isNotEditableContext.Provider>
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

// const generateNavItems = (form: ActionForm) => {
//   const type = form.get('type').value;
//   return [
//     {
//       label: t('in-automation:ActionCatalog.actionDetails'),
//       scrollId: '1-action-details',
//       title: t('in-automation:ActionCatalog.actionDetails'),
//       content: null,
//       valid: isMetadataValid(form)
//     },
//     {
//       label: t('in-automation:ActionCatalog.actionConfiguration'),
//       scrollId: '2-action-configuration',
//       title: t('in-automation:ActionCatalog.actionConfiguration'),
//       content: null,
//       valid: isActionConfigurationValid(form, type)
//     },
//     {
//       label: t('in-automation:ActionCatalog.parameterDetails'),
//       scrollId: '3-parameter-details',
//       title: t('in-automation:ActionCatalog.parameterDetails'),
//       content: null,
//       valid: true,
//       hidden: [ACTION_TYPE.DOC_LINK, ACTION_TYPE.MANUAL].includes(type ?? ACTION_TYPE.DOC_LINK)
//     }
//   ];
// };
const isNotEditableContext = createContext(false);

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
  const { isCopy, id } = useActionDetailsUrlParams1({ actionId, copy });
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
  const { isCopy } = useActionDetailsUrlParams1({ copy, actionId });

  return (
    <isNotEditableContext.Provider value={action ? isNotEditable(action, isCopy) : false}>
      <ActionFormContext.Provider
        value={{
          form, // Ensure form is of type ActionForm or convertible to Item
          rootPath: [],
          setForm // Ensure setForm matches React.Dispatch<React.SetStateAction<ActionForm>>
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
}
function useOnSubmit({ actionId, copy }: useOnSubmitProps) {
  const { createActionTrackerSegment, editActionTrackerSegment } = useSegmentTracker();
  const [result, setResult] = useState<Result<any> | null>(null);
  const { isNew, isCopy, id } = useActionDetailsUrlParams1({ actionId, copy });
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

            refresh();
            navigateToActionCatalog();
            close();
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

            refresh();
            navigateToActionCatalog();
            close();
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
