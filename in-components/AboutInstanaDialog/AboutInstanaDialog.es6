import React from 'react';

import { setActiveDialog } from 'in-components/DialogPresenter/store';
import Lettering from 'in-components/Lettering';
import Dialog from 'in-components/Dialog';
import build from 'in-services/build';

import './AboutInstanaDialog.less';

const block = 'about-instana-dialog';

export default function AboutInstanaDialog() {
  return (
    <Dialog header="About" onClose={() => setActiveDialog(null)}>
      <div className={block}>
        <Lettering className={`${block}__lettering`} />
        <span>
          {build.tag ? build.tag : '67357182903'}
        </span>
        <span className={`${block}__revision`}>
          {build.revision}
        </span>
      </div>
    </Dialog>
  );
}
