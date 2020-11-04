import React, { useState, useEffect } from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import TemporaryMessage from 'in-components/TemporaryMessage';
import Spacer from 'in-applications/Forms/components/Spacer';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import { goToPath } from 'in-stores/navigation';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Title from 'in-components/Title';

import locals from './BasicForm.mless';

export default function BasicFormPropsEnrichment(props) {
  const entityResult = useObservable(props.getEntity(), []) ?? pendingResult;
  const [form, updateForm] = useState(getInitialState(props.getInitialForm, entityResult));
  useEffect(() => updateForm(getInitialState(props.getInitialForm, entityResult)), [entityResult]);

  return <BasicForm {...props} form={form} updateForm={updateForm} entityResult={entityResult} />;
}

function getInitialState(getInitialForm, entityResult) {
  if (entityResult.data) {
    return getInitialForm(entityResult.data);
  }
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
      content = <LoadingIndicator text="Loading data" height={100} />;
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

            {form && form.touched && (
              <Button
                icon={saving ? 'lib_actions_loading' : null}
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
        {(title || generalHelpText) && (
          <div className={locals.header}>
            {title && <h1 className={locals.heading}>{title}</h1>}
            {generalHelpText && (
              <Tooltip themeStyle="light" content={generalHelpText}>
                <SvgIcon className={locals.helpTextIcon} type="lib_help_error_help_outline" />
              </Tooltip>
            )}
          </div>
        )}

        {success && <TemporaryMessage message="Successfully saved." type="success" />}
        {error && <TemporaryMessage message="An error occurred, please try again." type="error" />}

        {title && <Spacer type="dark" />}

        {content}
      </div>
    );
  }

  setValue = (updateForm, path, value, form) => {
    updateForm(form.updateIn(path, field => field.setValue(value).setTouched(true)));
  };
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
