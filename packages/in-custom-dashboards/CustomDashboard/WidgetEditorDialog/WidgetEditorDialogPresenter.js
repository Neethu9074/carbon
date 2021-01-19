/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import WidgetTypeSelector from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetTypeSelector/WidgetTypeSelector';
import IndeterminateLoadingIndicator from 'in-new-components/LoadingIndicators/IndeterminateLoadingIndicator';
import WidgetConfiguration from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetConfiguration';
import FormFooter, { SaveButton, CancelButton } from 'in-components/form/FormFooter/FormFooter';
import DialogWithSlideInView from 'in-new-components/Dialog/DialogWithSlideInView';
import { sizes as ICON_SIZES } from 'in-components/SvgIcon/SvgIcon';
import { close } from 'in-components/DialogPresenter/store';
import widgets from 'in-custom-dashboards/widgets';

import locals from './WidgetEditorDialogPresenter.mless';

const formId = 'widget-editor';

export default function WidgetEditorDialogPresenter({
  showWidgetSelector,
  setShowWidgetSelector,
  isEditing,
  onSubmit,
  onChange,
  form,
  onChangeType,
  slideInView,
  setSlideInView,
  isMigrating
}) {
  const subSlideState = useState(null);

  let title = isEditing ? 'Edit Widget' : 'Add Widget';
  if (!showWidgetSelector && !isMigrating) {
    title += ` – ${widgets[form.get('type').value].label}`;
  }

  return (
    <DialogWithSlideInView
      titleIconType={isEditing ? 'lib_actions_edit' : 'lib_openclose_add_circle_outline'}
      title={title}
      onClose={close}
      doNotCloseOnOutsideClick
      className={locals.dialog}
      slideInViewVisible={slideInView?.visible}
      onSlideInViewTitleClick={slideInView?.slideOutHandler?.(slideOut, subSlideState) ?? slideOut}
      slideInViewTitle={slideInView?.renderTitle?.(subSlideState[0]) ?? slideInView?.title}
      slideInViewComponent={slideInView?.getContent?.({
        slideOut,
        subSlideState
      })}
      removeBottomPaddingWhenFooterIsShown
      footer={
        !isMigrating && (
          <FormFooter className={locals.controls} withRoundedBottomBorder>
            {isEditing && <CancelButton onClick={close} />}
            {!isEditing && showWidgetSelector && <CancelButton onClick={close} />}
            {!isEditing && !showWidgetSelector && (
              <CancelButton onClick={() => setShowWidgetSelector(true)}>Back</CancelButton>
            )}
            <SaveButton formId={formId} form={form}>
              {showWidgetSelector && 'Next'}
              {!showWidgetSelector && (isEditing ? 'Confirm' : 'Create')}
            </SaveButton>
          </FormFooter>
        )
      }
    >
      {isMigrating && (
        <div className={locals.migrationWrapper}>
          <IndeterminateLoadingIndicator size={ICON_SIZES.xxxl} />
        </div>
      )}

      {!isMigrating && (
        <form
          id={formId}
          onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {showWidgetSelector && <WidgetTypeSelector form={form} onChangeType={onChangeType} />}

          {!showWidgetSelector && (
            <WidgetConfiguration
              onChange={onChange}
              form={form}
              setSlideInView={newSlideInView =>
                setSlideInView({
                  ...newSlideInView,
                  // Enforce that setSlideInView cannot be used to hide the slide in view! For this purpose
                  // the slideOut function should be used. This guarantees a good user experience by ensuring
                  // that we retain the slide in view configuration at least until the CSS transitions
                  // complete.
                  visible: true
                })
              }
            />
          )}
        </form>
      )}
    </DialogWithSlideInView>
  );

  function slideOut() {
    setSlideInView({
      ...slideInView,
      visible: false
    });
  }
}
