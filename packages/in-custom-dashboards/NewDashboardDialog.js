import { createField, notBlankValidator } from 'formalistic';
import { compose, withProps, withState } from 'recompose';

import PromptPresenter from 'in-new-components/BigHeaderDialog/PromptPresenter';
import { goToCustomDashboard } from 'in-custom-dashboards/navigation/url';
import { addCustomDashboard } from 'in-custom-dashboards/api';
import { close } from 'in-components/DialogPresenter/store';
import { user } from 'in-stores/user';

export default compose(
  withState('state', 'setState', {
    field: createField({
      value: '',
      validator: notBlankValidator
    }),
    isSaving: false,
    errors: null
  }),
  withProps(({ state, setState }) => ({
    header: 'Create New Dashboard',
    headerIcon: 'lib_views_grid',
    inputLabel: 'Dashboard Name',
    confirmButtonLabel: 'Create',
    ...state,
    onChange: newValue =>
      setState({
        ...state,
        errors: null,
        field: state.field.setValue(newValue).setTouched(true)
      }),
    onSubmit() {
      if (!state.field.valid) {
        setState({
          ...state,
          errors: null,
          field: state.field.setTouched(true)
        });
        return;
      }

      setState({
        ...state,
        isSaving: true,
        errors: null
      });

      addCustomDashboard({
        title: state.field.value,
        accessRules: [
          {
            accessType: 'READ_WRITE',
            relationType: 'USER',
            relatedId: user.id
          }
        ],
        widgets: []
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
  }))
)(PromptPresenter);
