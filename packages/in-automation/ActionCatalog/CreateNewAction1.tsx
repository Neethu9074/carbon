/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { createContext, useContext } from 'react';
import { Tearsheet } from '@instana/ibm-products';
// import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
// import ServerTablePresenterWrapper from 'in-automation/ActionCatalog/ServerTablePresenterWrapper';
// import { ActionForm, MappedHeader } from 'in-automation/ActionCatalog/useActionForm/types';
// import { useIsNotEditableContext } from 'in-automation/ActionCatalog/Action';
// import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
// import TouchedMessages from 'in-components/form/TouchedMessages';
// import Input from 'in-components/form/Input';
import { close } from 'in-components/DialogPresenter/store';

//import useNavigateToActionCatalog from 'in-automation/navigation/hooks/useNavigateToActionCatalog';
// import Label from 'in-components/form/Label';
//import useActionFormSubmission from 'in-automation/ActionCatalog/useActionFormSubmission';
import useActionForm from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import useActionDetailsUrlParams from 'in-automation/ActionCatalog/useActionDetailsUrlParams';
//import { ActionForm } from 'in-automation/ActionCatalog/useActionForm/types';
import SideNav from 'in-components/SideNav';
//import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t } from 'in-i18n';
// import { seconds } from 'in-services/time';
import Title from 'in-components/Title/Title';

import { themes } from '@instana/design-tokens';
//import { Error } from '@instana/types';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { ActionFormBody } from 'in-automation/ActionCatalog/ActionForm';

import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import useActionFilter from 'in-automation/hooks/useActionFilter';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import useAction from 'in-automation/ActionCatalog/useAction';
import { hasError, isLoading } from 'in-services/util/result';
import SectionLine from 'in-settings/components/SectionLine';
import { isNotEditable } from 'in-automation/utils/action';
import { ActionFilter } from 'in-automation/types';
import { useSegmentTracker } from 'in-automation/tracker';

import { aiOriginatedMetadata, isAIAction, isAIActionCopy } from 'in-automation/utils/action';
// import useActionDetailsUrlParams from 'in-automation/ActionCatalog/useActionDetailsUrlParams';
import { getActionFromForm } from 'in-automation/ActionCatalog/useActionForm/utils';
// import { ActionForm } from 'in-automation/ActionCatalog/useActionForm/types';
// import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { saveAction, saveNewAction } from 'in-automation/api';
// import Form from 'in-components/form/binding/Form';

// const getColumnDefinitions = ({
//   form,
//   setForm,
//   isNotEditable
// }: {
//   form: ActionForm;
//   setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
//   isNotEditable: boolean;
// }): ColumnDefinition<MappedHeader>[] => [
//   {
//     id: 'key',
//     sortable: false,
//     label: t('in-automation:ActionCatalog.key'),
//     getContent(item) {
//       const field = form.get('additionalHeaders');
//       return (
//         <>
//           <HorizontalFlexWrapper>
//             <Input
//               value={item.value[0]}
//               disabled={isNotEditable}
//               hasError={!field?.valid && field?.touched && item.value[0] === ''}
//               onChange={e => {
//                 const updatedAdditionalHeaders = [...field.value];
//                 const index = updatedAdditionalHeaders.findIndex(header => header?.id === item.id);
//                 updatedAdditionalHeaders[index] = {
//                   id: item.id,
//                   value: [e.target.value, updatedAdditionalHeaders[index].value[1]]
//                 };
//                 setForm(form =>
//                   form.updateIn(['additionalHeaders'], item => item.setValue(updatedAdditionalHeaders).setTouched(true))
//                 );
//               }}
//               maxLength={128}
//             />
//           </HorizontalFlexWrapper>
//           {item.value[0] === '' && <TouchedMessages field={field} />}
//         </>
//       );
//     }
//   },
//   {
//     id: 'value',
//     sortable: false,
//     label: t('in-automation:value'),
//     getContent(item) {
//       const field = form.get('additionalHeaders');
//       return (
//         <>
//           <HorizontalFlexWrapper>
//             <Input
//               value={item.value[1]}
//               disabled={isNotEditable}
//               hasError={!field?.valid && field?.touched && item.value[1] === ''}
//               onChange={e => {
//                 const updatedAdditionalHeaders = [...field.value];
//                 const index = updatedAdditionalHeaders.findIndex(header => header?.id === item.id);
//                 updatedAdditionalHeaders[index] = {
//                   id: item.id,
//                   value: [updatedAdditionalHeaders[index].value[0], e.target.value]
//                 };
//                 setForm(form =>
//                   form.updateIn(['additionalHeaders'], item => item.setValue(updatedAdditionalHeaders).setTouched(true))
//                 );
//               }}
//               maxLength={128}
//             />
//           </HorizontalFlexWrapper>
//           {item.value[1] === '' && <TouchedMessages field={field} />}
//         </>
//       );
//     }
//   }
// ];

// interface AdditionalHeadersProps {
//   form: ActionForm;
//   setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
// }

export default function CreateNewAction() {
  // const isNotEditable = useIsNotEditableContext();''
  const { isNew, isCopy, id } = useActionDetailsUrlParams();
  const action = useAction({ id, isCopy });
  const data = action.data!;
  const actionFilter = useActionFilter();
  const actionFilterData = actionFilter.data!;

  // const loading = isLoading(action, actionFilter);
  // const errored = hasError(action, actionFilter);
  // // const columnDefinitions = getColumnDefinitions({ form, setForm, isNotEditable });
  // // const field = form.get('additionalHeaders');
  // const navigateToActionCatalog = useNavigateToActionCatalog();
  const { createActionTrackerSegment, editActionTrackerSegment } = useSegmentTracker();
  // const { isNew, isCopy } = useActionDetailsUrlParams();
  // const action = useAction({ id, isCopy });
  const [form] = useActionForm({ action: data, actionFilter: actionFilterData });

  // const [submitStatus, doSubmit] = useActionFormSubmission();
  function onSubmit() {
    const actionSpecification = getActionFromForm(form, action.data!);
    const aiOriginated = action.data && (isAIAction(action.data) || isAIActionCopy(action.data)) ? true : false;
    const trackerDetails = {
      actionName: actionSpecification.name,
      actionType: actionSpecification.type,
      aiOriginated
    };

    if (isNew) {
      createActionTrackerSegment(trackerDetails);

      return saveNewAction({
        ...actionSpecification,
        metadata: aiOriginated && isCopy ? aiOriginatedMetadata : undefined
      });
    } else {
      editActionTrackerSegment(trackerDetails);

      return saveAction(actionSpecification, id!);
    }
  }

  // function onSubmit(form: ActionForm) {
  //   const name = form.get('name').value;
  //   doSubmit({
  //     payload: { form, action.data },
  //     onError: res => {
  //       if (isNew) onSaveFailure(res?.errors);
  //       else onEditFailure(res?.errors);
  //     },
  //     onSuccess: () => {
  //       if (isNew) onSaveSuccess(name);
  //       else onEditSuccess(name);
  //       navigateToActionCatalog();
  //     }
  //   });
  // }

  const actionButtons = [
    {
      kind: 'primary',
      label: 'Save Action',
      onClick: () => {
        onSubmit();
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
    // <ServerTablePresenterWrapper
    //   columnDefinitions={columnDefinitions}
    //   formKey="additionalHeaders"
    //   defaultRow={['', '']}
    //   noDataMessage={t('in-automation:ActionCatalog.noAdditionalHeadersConfigured')}
    //   leftHeader={
    //     <Label htmlFor="action-contentType" hasError={!field.valid && field.touched}>
    //       {t('in-automation:ActionCatalog.additionalHeadersOptional')}
    //     </Label>
    //   }
    // />
    // @ts-expect-error: Suppressing this error as the `children` prop is unsupported in the type definitions but works correctly at runtime for our use case.
    <Tearsheet
      className="ttt"
      open
      influencer={influencerContent()}
      title="create action"
      description="create action description"
      actions={actionButtons}
    >
      {/* {renderTabPanels()} */}

      <>
        <Title title={t('in-automation:ActionCatalog.action')} />
        <ActionDetailsLoader />
      </>
    </Tearsheet>
  );
}

const influencerContent = () => {
  return (
    <SideNav
      navItems={navItems}
      // renderPostIcon={({ valid }) => {
      //   if (valid) return null;
      //   return <SvgIcon className={locals.icon} type="lib_help_error_error_circle" size="xs" />;
      // }}
    />
  );
};

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
  },
  {
    // content: <SloObjectiveSection />,
    label: t('in-service-levels:createSloDialog.selectObjectiveTitle'),
    scrollId: '3-select-objective',
    title: t('in-service-levels:createSloDialog.selectObjectiveTitle'),
    content: null
    // valid: isTargetFieldValid && isDateFieldValid && isTimeFieldValid
  }
];
const isNotEditableContext = createContext(false);

export function useIsNotEditableContext() {
  return useContext(isNotEditableContext);
}
// function onSaveSuccess(name: string) {
//   addMessage(
//     {
//       type: 'info',
//       timeout: seconds.toMillis(4),
//       title: t('in-automation:ActionCatalog.createDialog.success.title'),
//       content: t('in-automation:ActionCatalog.createDialog.success.content', {
//         name
//       })
//     },
//     'action-save-success'
//   );
// }

// function onSaveFailure(errors: Error[] | undefined) {
//   if (errors) {
//     errors.forEach(error =>
//       addMessage(
//         {
//           type: 'danger',
//           timeout: seconds.toMillis(6),
//           title: t('in-automation:ActionCatalog.createDialog.failure.title'),
//           content: (
//             <Trans
//               i18nKey="in-automation:ActionCatalog.createDialog.failure.content"
//               values={{ errorMessage: error.message }}
//             />
//           )
//         },
//         'action-save-failure'
//       )
//     );
//   } else {
//     addMessage(
//       {
//         type: 'danger',
//         timeout: seconds.toMillis(6),
//         title: t('in-automation:ActionCatalog.createDialog.failure.title'),
//         content: (
//           <Trans
//             i18nKey="in-automation:ActionCatalog.createDialog.failure.content"
//             values={{ errorMessage: t('in-components:error.erroneousResultPresenterMessage') }}
//           />
//         )
//       },
//       'action-save-failure'
//     );
//   }
// }

// function onEditSuccess(name: string) {
//   addMessage(
//     {
//       type: 'info',
//       timeout: seconds.toMillis(4),
//       title: t('in-automation:ActionCatalog.editDialog.success.title'),
//       content: t('in-automation:ActionCatalog.editDialog.success.content', {
//         name
//       })
//     },
//     'action-edit-success'
//   );
// }

// function onEditFailure(errors: Error[] | undefined) {
//   if (errors) {
//     errors.forEach(error =>
//       addMessage(
//         {
//           type: 'danger',
//           timeout: seconds.toMillis(6),
//           title: t('in-automation:ActionCatalog.editDialog.failure.title'),
//           content: (
//             <Trans
//               i18nKey="in-automation:ActionCatalog.editDialog.failure.content"
//               values={{ errorMessage: error.message }}
//             />
//           )
//         },
//         'action-edit-failure'
//       )
//     );
//   } else {
//     addMessage(
//       {
//         type: 'danger',
//         timeout: seconds.toMillis(6),
//         title: t('in-automation:ActionCatalog.editDialog.failure.title'),
//         content: (
//           <Trans
//             i18nKey="in-automation:ActionCatalog.editDialog.failure.content"
//             values={{ errorMessage: t('in-components:error.erroneousResultPresenterMessage') }}
//           />
//         )
//       },
//       'action-edit-failure'
//     );
//   }
// }

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

interface ActionDetailsProps {
  action?: ActionFormEntity;
  actionFilter: 'all' | ActionFilter;
}

function ActionDetails({ action, actionFilter }: ActionDetailsProps) {
  // const navigateToActionCatalog = useNavigateToActionCatalog();
  const { isCopy } = useActionDetailsUrlParams();
  // const [form, setForm] = useActionForm({ action, actionFilter });

  // const [submitStatus, doSubmit] = useActionFormSubmission();

  // function onSubmit(form: ActionForm) {
  //   const name = form.get('name').value;
  //   doSubmit({
  //     payload: { form, action },
  //     onError: res => {
  //       if (isNew) onSaveFailure(res?.errors);
  //       else onEditFailure(res?.errors);
  //     },
  //     onSuccess: () => {
  //       if (isNew) onSaveSuccess(name);
  //       else onEditSuccess(name);
  //       navigateToActionCatalog();
  //     }
  //   });
  // }

  return (
    <isNotEditableContext.Provider value={action ? isNotEditable(action, isCopy) : false}>
      {/* <Form form={form} setForm={form => setForm(form as ActionForm)}> */}
      {/* <ActionFormHeader action={action} /> */}
      <SectionLine />
      <ActionFormBody action={action} actionFilter={actionFilter} />
      {/* <ActionFormFooter submitStatus={submitStatus} action={action} /> */}
      {/* </Form> */}
    </isNotEditableContext.Provider>
  );
}
