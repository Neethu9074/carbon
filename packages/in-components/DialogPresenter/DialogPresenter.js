import React from 'react';

import { activeDialogs$ } from 'in-components/DialogPresenter/store';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    activeDialogs: activeDialogs$
  },
  function DialogPresenter({ activeDialogs }) {
    useDisabledBodyScroll(activeDialogs.length > 0);
    return <>{React.Children.map(activeDialogs, (dialog, index) => React.cloneElement(dialog, { key: index }))}</>;
  }
);
