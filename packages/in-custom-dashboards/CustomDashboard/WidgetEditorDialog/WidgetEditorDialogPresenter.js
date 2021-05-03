/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SvgIconSizes } from '@instana/components';

import WidgetTypeSelector from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetTypeSelector/WidgetTypeSelector';
import IndeterminateLoadingIndicator from 'in-new-components/LoadingIndicators/IndeterminateLoadingIndicator';
import WidgetConfiguration from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetConfiguration';
import FormFooter, { SaveButton, CancelButton } from 'in-components/form/FormFooter/FormFooter';
import DialogWithSlideInView from 'in-new-components/Dialog/DialogWithSlideInView';
import widgets from 'in-custom-dashboards/widgets';
import { t } from 'in-i18n';

import locals from './WidgetEditorDialogPresenter.mless';

const formId = 'widget-editor';

export default function WidgetEditorDialogPresenter({
  showWidgetSelector,
  handleCancelAndResetFormDirtyState,
  isEditing,
  onSubmit,
  onChange,
  onClose,
  form,
  onChangeType,
  slideInView,
  setSlideInView,
  isMigrating
}) {
  const subSlideState = useState(null);

  let title = isEditing
    ? t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetEditorDialogPresenter.editWidget')
    : t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetEditorDialogPresenter.addWidget');
  if (!showWidgetSelector && !isMigrating) {
    title += ` – ${widgets[form.get('type').value].label}`;
  }

  return (
    <DialogWithSlideInView
      titleIconType={isEditing ? 'lib_actions_edit' : 'lib_openclose_add_circle_outline'}
      title={title}
      onClose={onClose}
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
            {isEditing && <CancelButton onClick={onClose} />}
            {!isEditing && showWidgetSelector && <CancelButton onClick={onClose} />}
            {!isEditing && !showWidgetSelector && (
              <CancelButton onClick={() => handleCancelAndResetFormDirtyState()}>
                {t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetEditorDialogPresenter.back')}
              </CancelButton>
            )}
            <SaveButton formId={formId} form={form}>
              {showWidgetSelector &&
                t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetEditorDialogPresenter.next')}
              {!showWidgetSelector &&
                (isEditing
                  ? t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetEditorDialogPresenter.confirm')
                  : t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetEditorDialogPresenter.create'))}
            </SaveButton>
          </FormFooter>
        )
      }
    >
      {isMigrating && (
        <div className={locals.migrationWrapper}>
          <IndeterminateLoadingIndicator size={SvgIconSizes.xxxl} />
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
