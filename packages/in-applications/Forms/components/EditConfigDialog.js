import React, { Fragment } from 'react';

import { close } from 'in-components/DialogPresenter/store';
import SvgIcon from 'in-components/SvgIcon';
import Dialog from 'in-components/Dialog';

import locals from './EditConfigDialog.mless';

export default function EditConfigDialog({ title, content }) {
  return (
    <Dialog
      customHeaderClassName={locals.customHeader}
      contentWrapperClassName={locals.contentWrapper}
      contentClassName={locals.content}
      customHeader={
        <Fragment>
          <h3 className={locals.title}>{title}</h3>
          <SvgIcon className={locals.cancelIcon} type="lib_openclose_cancel" width={32} height={32} onClick={close} />
        </Fragment>
      }
      onClose={close}
    >
      {content}
    </Dialog>
  );
}
