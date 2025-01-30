/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { createContext, useContext } from 'react';

import { Tearsheet } from '@instana/ibm-products';
import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import useNavigateToActionCatalog from 'in-automation/navigation/hooks/useNavigateToActionCatalog';
import useActionDetailsUrlParams from 'in-automation/ActionCatalog/useActionDetailsUrlParams';
import { aiOriginatedMetadata, isAIAction, isAIActionCopy } from 'in-automation/utils/action';
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
import useAction from 'in-automation/ActionCatalog/useAction';
import { hasError, isLoading } from 'in-services/util/result';
import { saveAction, saveNewAction } from 'in-automation/api';
import SectionLine from 'in-settings/components/SectionLine';
import { close } from 'in-components/DialogPresenter/store';
import { isNotEditable } from 'in-automation/utils/action';
import { useSegmentTracker } from 'in-automation/tracker';
import { ACTION_TYPE } from 'in-automation/constants';
import { ActionFilter } from 'in-automation/types';
import Title from 'in-components/Title/Title';
import SideNav from 'in-components/SideNav';
import { seconds } from 'in-services/time';
import { t, Trans } from 'in-i18n';

export default function CreateNewAction() {
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
      // @ts-expect-error
      <Tearsheet
        className="ttt"
        open
        title="create action"
        description="create action description"
        // actions={actionButtons}
      >
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

  return <TearSheetLoader key={String(isCopy)} action={action.data} actionFilter={actionFilter.data!} />;
}

interface TearSheetProps {
  action?: ActionFormEntity;
  actionFilter: 'all' | ActionFilter;
}

function TearSheetLoader({ action, actionFilter }: TearSheetProps) {
  const { isCopy } = useActionDetailsUrlParams();
  const [form, setForm] = useActionForm({ action, actionFilter });
  const { onSubmit } = useOnSubmit();

  const actionButtons = [
    {
      kind: 'primary',
      label: 'Save Action',
      onClick: () => {
        onSubmit({ form });
      }
    } as any,
    {
      kind: 'ghost',
      label: 'Cancel',
      onClick: () => {
        close();
      }
    }
  ];

  return (
    <isNotEditableContext.Provider value={action ? isNotEditable(action, isCopy) : false}>
      {/* @ts-expect-error */}
      <Tearsheet
        className="ttt"
        open
        influencer={influencerContent(action)}
        title="create action"
        description="create action description"
        actions={actionButtons}
      >
        <>
          <Title title={t('in-automation:ActionCatalog.action')} />
          <ActionDetailsLoader form={form} setForm={form => setForm(form as ActionForm)} />
        </>
      </Tearsheet>
    </isNotEditableContext.Provider>
  );
}

const influencerContent = (action?: ActionFormEntity) => {
  return (
    <SideNav
      navItems={generateNavItems(action)}
      renderPostIcon={({ valid }) => {
        if (valid) return null;
        return <SvgIcon className="icon" type="lib_help_error_error_circle" size="xs" />;
      }}
    />
  );
};

const generateNavItems = (action?: ActionFormEntity) => {
  const showParametersSection = ![ACTION_TYPE.DOC_LINK, ACTION_TYPE.MANUAL].includes(
    action?.type ?? ACTION_TYPE.DOC_LINK
  );
  const navItems = [
    {
      label: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      scrollId: '1-select-entity',
      title: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      content: null
      // valid: isEntityIdFieldValid
    },
    {
      label: t('in-service-levels:createSloDialog.selectIndicatorNavItem'),
      scrollId: '2-select-indicator',
      title: t('in-service-levels:createSloDialog.selectIndicatorNavItem'),
      content: null
      // valid: isIndicatorValid && isThresholdValid
    }
  ];

  if (showParametersSection) {
    navItems.push({
      label: t('in-service-levels:createSloDialog.selectObjectiveTitle'),
      scrollId: '3-select-objective',
      title: t('in-service-levels:createSloDialog.selectObjectiveTitle'),
      content: null
    });
  }

  return navItems;
};
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
  setForm
}: {
  form: ActionForm;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
}) {
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

  return (
    <ActionDetails
      key={String(isCopy)}
      action={action.data}
      actionFilter={actionFilter.data!}
      form={form}
      setForm={form => setForm(form as ActionForm)}
    />
  );
}

interface ActionDetailsProps {
  action?: ActionFormEntity;
  actionFilter: 'all' | ActionFilter;
  form: ActionForm;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
}

function ActionDetails({ action, actionFilter, form, setForm }: ActionDetailsProps) {
  // const navigateToActionCatalog = useNavigateToActionCatalog();
  // console.log('actionFilter testtt----------', actionFilter);
  const { isCopy } = useActionDetailsUrlParams();

  return (
    <isNotEditableContext.Provider value={action ? isNotEditable(action, isCopy) : false}>
      <ActionFormContext.Provider
        value={{
          form, // Ensure form is of type ActionForm or convertible to Item
          rootPath: [],
          setForm // Ensure setForm matches React.Dispatch<React.SetStateAction<ActionForm>>
        }}
      >
        <ActionFormBody action={action} actionFilter={actionFilter} />
      </ActionFormContext.Provider>
    </isNotEditableContext.Provider>
  );
}

function useOnSubmit() {
  const { createActionTrackerSegment, editActionTrackerSegment } = useSegmentTracker();
  // const [result, setResult] = useState<Result<any> | null>(null);
  const { isNew, isCopy, id } = useActionDetailsUrlParams();
  const navigateToActionCatalog = useNavigateToActionCatalog();
  function onSubmit({ form, action }: { form: ActionForm; action?: ActionFormEntity }) {
    const actionSpecification = getActionFromForm(form, action);
    // console.log('innnnn', actionSpecification);
    const aiOriginated = action && (isAIAction(action) || isAIActionCopy(action)) ? true : false;
    const trackerDetails = {
      actionName: actionSpecification.name,
      actionType: actionSpecification.type,
      aiOriginated
    };

    if (isNew) {
      // console.log('innnnn tttt', actionSpecification);

      // return saveNewAction({
      //   ...actionSpecification,
      //   metadata: aiOriginated && isCopy ? aiOriginatedMetadata : undefined
      // });

      return saveNewAction({
        ...actionSpecification,
        metadata: aiOriginated && isCopy ? aiOriginatedMetadata : undefined
      })
        .filter(res => !isLoading(res))
        .once(
          result => {
            // setResult(result);
            if (hasError(result)) return;
            // trackAction();
            createActionTrackerSegment(trackerDetails);
            onSaveSuccess(result.data?.name!);
            navigateToActionCatalog();
            // refresh();
            close();
          },
          result => {
            // const err = error([
            //   { code: 'SERVER', message: t('in-automation:GenerateAIActionDialog.failedToCreateAction') }
            // ]);
            onSaveFailure(result?.errors);
          }
        );
    } else {
      return saveAction(actionSpecification, id!)
        .filter(res => !isLoading(res))
        .once(
          result => {
            // setResult(result);
            if (hasError(result)) return;
            // trackAction();
            editActionTrackerSegment(trackerDetails);
            onEditSuccess(result.data?.name!);
            navigateToActionCatalog();
            // refresh();
            close();
          },
          result => {
            // const err = error([
            //   { code: 'SERVER', message: t('in-automation:GenerateAIActionDialog.failedToCreateAction') }
            // ]);
            onEditFailure(result?.errors);
          }
        );
    }
  }
  return {
    onSubmit
    // result
  };
}

// const { result, onSubmit } = useOnSubmit();
