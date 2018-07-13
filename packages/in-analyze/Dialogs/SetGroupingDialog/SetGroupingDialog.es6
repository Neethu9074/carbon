import React, { Fragment } from 'react';
import { withState } from 'recompose';

import { settings$, set } from 'in-services/settings/settings';
import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Dialog from 'in-components/Dialog';

import locals from './SetGroupingDialog.mless';

export default withState('isCeckboxChecked', 'setIsCeckboxChecked', false)(SetGroupingDialog);

function SetGroupingDialog({ isCeckboxChecked, setIsCeckboxChecked, onOk }) {
  return (
    <Dialog
      customHeaderClassName={locals.customHeader}
      contentWrapperClassName={locals.contentWrapper}
      contentClassName={locals.content}
      customHeader={
        <Fragment>
          <div className={locals.checkBoxWrapper}>
            <input
              className={locals.checkBox}
              type="checkbox"
              checked={isCeckboxChecked}
              onChange={() => setIsCeckboxChecked(!isCeckboxChecked)}
            />Don’t show this message again
          </div>
          <SvgIcon className={locals.cancelIcon} type="lib_openclose_cancel" width={32} height={32} onClick={close} />
        </Fragment>
      }
      onClose={() => close()}
    >
      <Fragment>
        <SvgIcon className={locals.analyzeIcon} type="lib_analyze" width={56} height={56} onClick={close} />
        <h1 className={locals.heading}>Ungroup & Filter by</h1>
        <p className={locals.text}>
          Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind
          texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.
        </p>
        <Button
          kind="create"
          onClick={() => {
            if (isCeckboxChecked) {
              settings$.once(currentSettings => {
                currentSettings['showAnalyzeGroupingPopup'] = false;
                set(currentSettings);

                close();
                onOk();
              });
            } else {
              close();
              onOk();
            }
          }}
        >
          Ok, got it!
        </Button>
      </Fragment>
    </Dialog>
  );
}
