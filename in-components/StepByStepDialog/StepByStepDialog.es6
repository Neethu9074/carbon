import React from 'react';

import { close } from 'in-components/DialogPresenter/store';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import Dialog from 'in-components/Dialog';

import './/StepByStepDialog.less';

const block = 'in-step-by-step-dialog';

export default class extends React.Component {
  static displayName = 'StepByStepDialog';

  state = {
    currentStep: 0
  };

  render() {
    const { header, steps, onSave = close } = this.props;
    const { currentStep } = this.state;

    return (
      <Dialog header={header} onClose={close} contentClassName={block}>
        {steps[currentStep]}

        <div className={`${block}__footer`}>
          {currentStep === steps.length - 1 ? (
            <Button kind="success" onClick={onSave}>
              Save
            </Button>
          ) : (
            <Button kind="success" onClick={() => this.setState({ currentStep: currentStep + 1 })}>
              Next
            </Button>
          )}
          {currentStep === 0 ? null : (
            <div className={`${block}__icon-wrapper`} onClick={() => this.setState({ currentStep: currentStep - 1 })}>
              <SvgIcon type="chevron_left" color="#6B8088" height={14} />
            </div>
          )}
        </div>
      </Dialog>
    );
  }
}
