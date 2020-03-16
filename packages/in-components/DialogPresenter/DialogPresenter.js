import React from 'react';

import { activeDialogs$ } from 'in-components/DialogPresenter/store';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    activeDialogs: activeDialogs$
  },
  function DialogPresenter({ activeDialogs }) {
    return React.Children.map(activeDialogs, (dialog, index) => React.cloneElement(dialog, { key: index }));
  }
);
