import React from 'react';

import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { graphPath } from 'in-stores/navigation/paths/mainPaths';
import { goToPath } from 'in-stores/navigation';
import Lettering from 'in-components/Lettering';
import { build } from 'in-services/config';
import Dialog from 'in-components/Dialog';
import Button from 'in-components/Button';

import './AboutInstanaDialog.less';

const block = 'about-instana-dialog';

export default function AboutInstanaDialog() {
  return (
    <Dialog header="About" onClose={() => setActiveDialog(null)}>
      <div className={block}>
        <Lettering className={`${block}__lettering`} />
        <span>{build.tag}</span>
        <span className={`${block}__revision`}>{build.revision}</span>

        <Button
          className={`${block}__button`}
          onClick={() => {
            goToPath(graphPath);
            setActiveDialog(null);
          }}
        >
          Graph Showcase
        </Button>
      </div>
    </Dialog>
  );
}
