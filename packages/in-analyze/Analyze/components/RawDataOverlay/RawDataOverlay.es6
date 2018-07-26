import React from 'react';

import { showRawData as showRawDataMatrixParameter } from 'in-analyze/navigation/matrix';
import BackToGroupButton from 'in-analyze/Analyze/components/BackToGroupButton';
import { close } from 'in-components/DialogPresenter/store';
import SvgIcon from 'in-components/SvgIcon';
import RawCalls from 'in-analyze/RawCalls';
import Dialog from 'in-components/Dialog';

import locals from './RawDataOverlay.mless';

export default class extends React.Component {
  static displayName = 'RawDataOverlay';

  componentWillUnmount() {
    closeAndRemoveFlag(this.props.onChangeFilters);
  }

  render() {
    const { filterByGroup, onChangeFilters } = this.props;

    return (
      <Dialog
        customHeaderClassName={locals.customHeader}
        contentWrapperClassName={locals.contentWrapper}
        contentClassName={locals.content}
        customHeader={
          <div className={locals.header}>
            <div className={locals.left}>
              <BackToGroupButton onClick={() => closeAndRemoveFlag(onChangeFilters)} />
              <span className={locals.groupName}>Group: {filterByGroup.value}</span>
            </div>
            <SvgIcon
              className={locals.closeIcon}
              type="lib_openclose_cancel"
              width={36}
              height={36}
              onClick={() => closeAndRemoveFlag(onChangeFilters)}
            />
          </div>
        }
        onClose={() => closeAndRemoveFlag(onChangeFilters)}
      >
        <RawCalls {...this.props} />
      </Dialog>
    );
  }
}

function closeAndRemoveFlag(onChangeFilters) {
  const newState = {};
  newState[showRawDataMatrixParameter] = null;
  onChangeFilters(newState);

  close();
}
