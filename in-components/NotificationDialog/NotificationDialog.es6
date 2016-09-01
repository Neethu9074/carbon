import React from 'react';

import DialogV2 from 'in-components/DialogV2';

import './NotificationDialog.less';


const block = 'in-notification-dialog';

export default function NotificationDialog({title, children, onClose}) {
  return (
    <DialogV2 className={block}
              header={title}
              onClose={onClose}>
      {children}
    </DialogV2>
  );
}
