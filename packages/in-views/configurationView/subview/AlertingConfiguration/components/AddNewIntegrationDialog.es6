import { fromJS } from 'immutable';
import React from 'react';

import IntegrationSwitch from 'in-views/configurationView/subview/Integrations/components/IntegrationSwitch';
import configs from 'in-views/configurationView/subview/Integration/configs';
import { saveIntegration } from 'in-services/api/integrations';
import LoadingIndicator from 'in-components/LoadingIndicator';
import StepByStepDialog from 'in-components/StepByStepDialog';
import { close } from 'in-components/DialogPresenter/store';

import './AddNewIntegrationDialog.less';

const block = 'in-alerting-add-new-integration-dialog';

export default class extends React.Component {
  static displayName = 'AddNewIntegrationDialog';

  state = {
    selectedType: null,
    form: null,
    Form: null
  };

  componentWillUpdate(nextProps, nextState) {
    if (this.state.selectedType !== nextState.selectedType) {
      this.setState({
        form: configs[nextState.selectedType].createForm(),
        Form: configs[nextState.selectedType].Form
      });
    }
  }

  componentWillUnmount() {
    this.disposeAsyncAction();
  }

  render() {
    const { selectedType } = this.state;
    const steps = [
      <div className={block}>
        <IntegrationSwitch onClick={selectedType => this.setState({ selectedType })} selectedType={selectedType} />
      </div>,

      <div className={block}>
        <Form state={this.state} onChange={this.onChange} />
      </div>
    ];
    return (
      <StepByStepDialog
        header="Add New Integration"
        steps={steps}
        onSave={this.onSave}
        allowSaving={this.state.form && this.state.form.hierarchyValid}
      />
    );
  }

  onChange = (fieldName, value) => {
    let updatedForm = this.state.form;
    updatedForm = updatedForm.updateIn([fieldName], field => field.setValue(value).setTouched(true));

    this.setState({
      form: updatedForm
    });
  };

  onSave = () => {
    const integration = fromJS(configs[this.state.selectedType].createEntity(null, this.state.form));
    const result$ = saveIntegration(integration);

    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: 'Saving…'
    });

    this.responseSubscription = result$.once(() => {
      this.props.onClose(integration);
      close();
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save: ${error.message}`;
      this.setState({
        loading: false,
        error: true,
        message
      });
    });
  };

  disposeAsyncAction = () => {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  };
}

function Form({ state, onChange }) {
  if (!state.Form) {
    return null;
  }

  if (state.loading) {
    return <LoadingIndicator type="dark" />;
  }

  if (state.error) {
    return state.message;
  }

  return <state.Form form={state.form} onChange={onChange} />;
}
