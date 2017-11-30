import React from 'react';

import { helpId$ } from 'in-components/helpSystem/helpSystemStores';
import HelpDialog from 'in-components/helpSystem/HelpDialog';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    helpId: helpId$
  },
  function HelpPresenter({ helpId }) {
    return helpId ? <HelpDialog id={helpId} /> : null;
  }
);
