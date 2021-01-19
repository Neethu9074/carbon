/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { compose, withProps, withState } from 'recompose';
import React from 'react';

import { goToCustomDashboard } from 'in-custom-dashboards/navigation/url';
import HorizontalFormGroup from 'in-components/form/HorizontalFormGroup';
import PromptPresenter from 'in-new-components/Dialog/PromptPresenter';
import { addCustomDashboard } from 'in-custom-dashboards/api';
import { close } from 'in-components/DialogPresenter/store';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import { user } from 'in-stores/user';

export default compose(
  withState('state', 'setState', ({ config }) => ({
    form: createMapForm()
      .put(
        'title',
        createField({
          value: `Copy of ${config.title}`,
          validator: notBlankValidator
        })
      )
      .put(
        'copySharingConfiguration',
        createField({
          value: false
        })
      ),
    isSaving: false,
    errors: null
  })),
  withProps(({ state, setState, config }) => ({
    header: 'Duplicate Dashboard',
    headerIcon: 'lib_views_grid',
    inputLabel: 'Dashboard Name',
    confirmButtonLabel: 'Duplicate',
    ...state,
    field: state.form.get('title'),
    onChange: newValue =>
      setState({
        ...state,
        errors: null,
        form: state.form.updateIn(['title'], f => f.setValue(newValue).setTouched(true))
      }),
    onSubmit() {
      if (!state.form.valid) {
        setState({
          ...state,
          errors: null,
          form: state.form.setTouched(true, { recurse: true })
        });
        return;
      }

      setState({
        ...state,
        isSaving: true,
        errors: null
      });

      let accessRules;
      if (state.form.get('copySharingConfiguration').value) {
        // The current user is guaranteed to have write access. If the user
        // wouldn't have write access, then config.accessRules would be an
        // empty array and we would never present the option to duplicate
        // the access rules.
        accessRules = config.accessRules;
      } else {
        accessRules = [
          {
            accessType: 'READ_WRITE',
            relationType: 'USER',
            relatedId: user.id
          }
        ];
      }

      addCustomDashboard({
        title: state.form.get('title').value,
        accessRules,
        widgets: config.widgets
      })
        .filter(response => response.data || response.errors.length > 0)
        .once(
          response => {
            if (response.data) {
              const customDashboardId = response.data.id;
              goToCustomDashboard(customDashboardId);
              close();
              return;
            }

            setState({
              ...state,
              isSaving: false,
              errors: response.errors
            });
          },
          () => {
            setState({
              ...state,
              isSaving: false,
              errors: [
                {
                  code: 'SERVER',
                  message: 'Failed to create dashboard.'
                }
              ]
            });
          }
        );
    }
  })),
  withProps(({ state, setState, config }) => ({
    additionalFields:
      config.accessRules.length > 0 &&
      state.form.get('copySharingConfiguration').map(field => (
        <HorizontalFormGroup
          label={
            <Label htmlFor="duplicate-dashboard-sharing" hasError={!field.valid && field.touched}>
              Copy Sharing Configuration
            </Label>
          }
          formElement={
            <Toggle
              id="duplicate-dashboard-sharing"
              checked={field.value}
              onChange={e =>
                setState({
                  ...state,
                  form: state.form.updateIn(['copySharingConfiguration'], f =>
                    f.setValue(e.target.checked).setTouched(true)
                  )
                })
              }
              disabled={state.isSaving}
            />
          }
        />
      ))
  }))
)(PromptPresenter);
