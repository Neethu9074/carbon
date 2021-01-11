import React from 'react';

import { addActiveDialog } from 'in-components/DialogPresenter/store';
import * as article from 'in-services/shortcuts/shortcuts.mmd';
import HelpDialog from 'in-components/helpSystem/HelpDialog';

export default function onPressed() {
  addActiveDialog(<HelpDialog article={article} />);
}
