import { fromJS } from 'immutable';
import React from 'react';

import forms from 'in-views/configurationView/subview/Integration/forms';
import { saveIntegration } from 'in-services/api/integrations';
import StepByStepDialog from 'in-components/StepByStepDialog';
import { close } from 'in-components/DialogPresenter/store';
import ComboBox from 'in-components/ComboBox';

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
        form: forms[nextState.selectedType].createForm(),
        Form: forms[nextState.selectedType].Form
      });
    }
  }

  componentWillUnmount() {
    this.disposeAsyncAction();
  }

  render() {
    const { selectedType } = this.state;
    const steps = [
      <ComboBox
        name="integrationType"
        value={selectedType}
        clearable={false}
        options={Object.keys(forms).map(type => {
          return {
            value: type,
            label: type
          };
        })}
        onChange={e => this.setState({ selectedType: e.value })}
      />,
      this.state.Form ? <this.state.Form form={this.state.form} onChange={this.onChange} /> : null
    ];
    return <StepByStepDialog header="Add New Integration" steps={steps} onSave={this.onSave} />;
  }

  onChange = (fieldName, value) => {
    let updatedForm = this.state.form;
    updatedForm = updatedForm.updateIn([fieldName], field => field.setValue(value).setTouched(true));

    this.setState({
      form: updatedForm
    });
  };

  onSave = () => {
    const result$ = saveIntegration(fromJS(forms[this.state.selectedType].createEntity(null, this.state.form)));

    this.disposeAsyncAction();
    // this.setState({
    //   loading: true,
    //   error: false,
    //   message: 'Saving…'
    // });

    this.responseSubscription = result$.once(() => {
      console.log('success');
      close();
    });

    this.errorSubscription = result$.errors().once(error => {
      console.log(`Failed to save: ${error.message}`);
      // const message = `Failed to save: ${error.message}`;
      // this.setState({
      //   loading: false,
      //   error: true,
      //   message
      // });
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
