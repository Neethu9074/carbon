import React from 'react';

import Dialog from 'in-components/Dialog';

import './NotificationDialog.less';

const block = 'in-notification-dialog';

export default function NotificationDialog({ title, children, onClose }) {
  return (
    <Dialog className={block} header={title} onClose={onClose}>
      {children}
    </Dialog>
  );
}
