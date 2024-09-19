/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import React, { useState, useEffect } from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import WidgetEditorDialogPresenter from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetEditorDialogPresenter';
import { CUSTOM_DASHBOARD_EDIT_WIDGET_CANCEL } from 'in-services/tracking/tracking';
import { stringValidator, numberValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import widgets, { enabledWidgets } from 'in-custom-dashboards/widgets';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { getTrackingMeta } from 'in-custom-dashboards/tracker';
import { close } from 'in-components/DialogPresenter/store';
import { pendingResult } from 'in-services/fixedObjects';

export default function WidgetEditorDialog({ widget, onSubmit }) {
  const [state, setState] = useState(() => getInitialState(widget));
  const { isMigrating, form, slideInView, showWidgetSelector } = state;
  const { trackCta } = useSegmentTracking();

  const migrationResult =
    useObservable(() => isMigrating && widgets[widget.type].migrate(widget.config), [widget]) ?? pendingResult;

  useEffect(() => {
    if (migrationResult?.data && state.isMigrating) {
      const form = getInitialFormState({
        ...widget,
        config: migrationResult.data
      });
      setState(prevState => ({
        ...prevState,
        form,
        isMigrating: false
      }));
    }
  }, [state, migrationResult, widget]);

  return (
    <WidgetEditorDialogPresenter
      isMigrating={isMigrating}
      migrationResult={migrationResult}
      form={form}
      isEditing={widget != null}
      showWidgetSelector={showWidgetSelector}
      handleCancelAndResetFormDirtyState={handleCancelAndResetFormDirtyState}
      onChange={(path, fn) => setForm(form.updateIn(path, fn))}
      onChangeType={type => {
        if (type === form.get('type').value) {
          return;
        }

        setForm(
          form
            .updateIn(['type'], field => field.setValue(type).setTouched(true))
            .put('config', widgets[type].createForm())
            // Do not show any validation failures when switching the widget type.
            .setTouched(false, { recurse: true })
        );
      }}
      onSubmit={() => {
        if (showWidgetSelector) {
          if (form.get('type').valid) {
            setShowWidgetSelector(false);
          }
          return;
        }

        if (!form.hierarchyValid) {
          setForm(form.setTouched(true, { recurse: true }));
          return;
        }

        onSubmit(form.toJS());
        close();
      }}
      onClose={() => {
        close();
        if (widget) {
          trackCta(CUSTOM_DASHBOARD_EDIT_WIDGET_CANCEL, getTrackingMeta(form.toJS()));
        }
      }}
      slideInView={slideInView}
      setSlideInView={setSlideInView}
    />
  );

  function setShowWidgetSelector(showWidgetSelector) {
    setState(prevState => ({
      ...prevState,
      showWidgetSelector
    }));
  }

  function handleCancelAndResetFormDirtyState() {
    setState(prevState => {
      const form = prevState.form.setTouched(false, { recurse: true });
      const showWidgetSelector = true;

      return {
        ...prevState,
        form,
        showWidgetSelector
      };
    });
  }

  function setForm(form) {
    setState(prevState => ({
      ...prevState,
      form
    }));
  }

  function setSlideInView(slideInView) {
    setState(prevState => ({
      ...prevState,
      slideInView
    }));
  }
}

export function getInitialState(widget) {
  const state = {
    isMigrating: false,
    form: null,
    slideInView: null,
    showWidgetSelector: false
  };

  if (widget) {
    state.isMigrating = Boolean(widgets[widget?.type]?.migrate);
    if (!state.isMigrating) {
      state.form = getInitialFormState(widget);
    }
  } else {
    state.form = getInitialFormState();
    state.showWidgetSelector = true;
  }

  return state;
}

export function getInitialFormState(widget) {
  let form = createMapForm()
    .put(
      'id',
      createField({
        value: widget?.id ?? generateUniqueShortId(),
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'width',
      createField({
        value: widget?.width ?? 1,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator)
      })
    )
    .put(
      'height',
      createField({
        value: widget?.height ?? 1,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator)
      })
    )
    .put(
      'x',
      createField({
        value: widget?.x ?? 0,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator)
      })
    )
    .put(
      'y',
      createField({
        value: widget?.y ?? 0,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator)
      })
    )
    .put(
      'title',
      createField({
        value: widget?.title ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator)
      })
    )
    .put(
      'type',
      createField({
        value: widget?.type ?? enabledWidgets[0].type,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          buildEnumValidator(enabledWidgets.map(({ type }) => type))
        )
      })
    );

  if (form.get('type').valid) {
    form = form.put('config', widgets[form.get('type').value].createForm(widget?.config));
  }

  return form;
}
