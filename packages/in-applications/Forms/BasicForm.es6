import { createField, createMapForm, notBlankValidator, composeValidators } from 'formalistic';
import React from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { regularExpressionValidator } from 'in-services/validators/regexp';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import withPropDependingState from 'in-hoc/withPropDependingState';
import TemporaryMessage from 'in-components/TemporaryMessage';
import Spacer from 'in-applications/Forms/components/Spacer';
import { isBlank } from 'in-services/util/string';
import { goToPath } from 'in-stores/navigation';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Title from 'in-components/Title';
import connect from 'in-hoc/connectTo';

import locals from './BasicForm.mless';

export default compose(
  connect(props => ({
    entityResult: props.getEntity()
  })),
  withPropDependingState({
    getInitialState,

    resets: [
      {
        getResettingProps: () => ['entityResult'],
        onReset: getInitialState
      }
    ],

    reducerName: 'updateForm',
    reducer: (_, newForm) => ({ form: newForm })
  })
)(props => <BasicForm {...props} />);

function getInitialState({ getInitialForm, entityResult }) {
  if (!entityResult.data) {
    return {
      form: null
    };
  }
  return {
    form: getInitialForm(entityResult.data)
  };
}

class BasicForm extends React.Component {
  state = {
    success: false,
    saving: false,
    error: false
  };

  onSubmit = (e, form) => {
    e.preventDefault();

    if (!form.hierarchyValid) {
      this.props.updateForm(form.setTouched(true, { recurse: true }));
      return;
    }

    const entityToUpdate = form.toJS();
    const result$ = this.props.updateEntity(entityToUpdate);
    this.setState({
      saving: true,
      success: false,
      error: false
    });

    result$.once(result => {
      this.setState({
        success: true,
        saving: false,
        error: false
      });

      if (this.props.getOnSavePath) {
        goToPath(this.props.getOnSavePath(result));
      }
    });

    result$.errors().once(() => {
      this.setState({
        success: false,
        saving: false,
        error: true
      });
    });
  };

  render() {
    const {
      entityResult,
      title,
      renderFormContent,
      generalHelpText,
      onCancelHref$,
      form,
      savingStateName = 'Saving…',
      saveButtonLabel = 'Save'
    } = this.props;
    const updateForm = form => this.props.updateForm(form.setTouched(true, { recurse: true }));
    const { saving, error, success } = this.state;

    const isLoading = entityResult.progress.loading;
    const hasErrors = entityResult.errors.length > 0;

    let content;
    if (isLoading) {
      content = <InfiniteCircle height={100} />;
    } else if (hasErrors) {
      content = <ErroneousResultPresenter errors={entityResult.errors} />;
    } else {
      content = (
        <form onSubmit={e => this.onSubmit(e, form, updateForm)} className={locals.form}>
          {form && renderFormContent(entityResult.data, form, this.setValue.bind(this, updateForm), updateForm)}

          <Spacer type="dark" />
          <div className={locals.footer}>
            {onCancelHref$ && (
              <Button kind="subtle" size="compact" href$={onCancelHref$}>
                cancel
              </Button>
            )}
            {!onCancelHref$ && <div />}

            {form &&
              form.touched && (
                <Button
                  icon={saving ? 'spinner' : null}
                  iconSpinning
                  kind="create"
                  type="submit"
                  disabled={(!form.hierarchyValid && form.touched) || saving}
                >
                  {saving ? savingStateName : saveButtonLabel}
                </Button>
              )}
          </div>
        </form>
      );
    }

    return (
      <div>
        <Title title={title} />
        <div className={locals.header}>
          <h1 className={locals.heading}>{title}</h1>
          {generalHelpText && (
            <Tooltip themeStyle="light" content={generalHelpText}>
              <SvgIcon className={locals.helpTextIcon} type="lib_help_error_help_outline" height={24} />
            </Tooltip>
          )}
        </div>

        {success && <TemporaryMessage message="Successfully saved." type="success" />}
        {error && <TemporaryMessage message="An error occurred, please try again." type="error" />}

        <Spacer type="dark" />

        {content}
      </div>
    );
  }

  setValue = (updateForm, path, value, form) => {
    updateForm(form.updateIn(path, field => field.setValue(value).setTouched(true)));
  };
}

export function getMatchSpecificationForm(matchSpecification = {}, defaultValue = '.*') {
  let form = createMapForm()
    .put(
      'key',
      createField({
        value: get(matchSpecification, 'key', ''),
        validator: notBlankValidator
      })
    )
    .put(
      'value',
      createField({
        value: get(matchSpecification, 'value', defaultValue),
        validator: composeValidators(regularExpressionValidator)
      })
    )
    .put(
      'operator',
      createField({
        value: get(matchSpecification, 'operator', 'EQUALS')
      })
    );

  if (!isBlank(get(matchSpecification, 'secondLevelName'))) {
    form = form.put(
      'secondLevelName',
      createField({
        value: get(matchSpecification, 'secondLevelName', ''),
        validator: notBlankValidator
      })
    );
  }

  return form;
}

export function matchSpecificationValidator(items) {
  if (items.length < 1) {
    return [
      {
        severity: 'error',
        message: 'At least one match condition is required.'
      }
    ];
  }

  return null;
}
