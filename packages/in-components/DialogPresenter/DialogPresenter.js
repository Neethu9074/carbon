import React from 'react';

import { activeDialogs$ } from 'in-components/DialogPresenter/store';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    activeDialogs: activeDialogs$
  },
  function DialogPresenter({ activeDialogs }) {
    return (
      <>
        {activeDialogs.length > 0 && <DisabledBodyScroll />}
        {React.Children.map(activeDialogs, (dialog, index) => React.cloneElement(dialog, { key: index }))}
      </>
    );
  }
);
