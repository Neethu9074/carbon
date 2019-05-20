import React, { Fragment } from 'react';

import getUiBackendVersion from 'in-subscription/getUiBackendVersion';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { graphPath } from 'in-stores/navigation/paths/mainPaths';
import { goToPath } from 'in-stores/navigation';
import Lettering from 'in-components/Lettering';
import { build } from 'in-services/config';
import Dialog from 'in-components/Dialog';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './AboutInstanaDialog.less';

const block = 'about-instana-dialog';

export default connectTo(
  {
    uiBackendVersion: getUiBackendVersion()
  },
  function AboutInstanaDialog({ uiBackendVersion }) {
    return (
      <Dialog header="About" onClose={() => setActiveDialog(null)}>
        <div className={block}>
          <Lettering className={`${block}__lettering`} />
          <span>UI: {build.tag}</span>
          <span className={`${block}__revision`}>{build.revision}</span>
          {uiBackendVersion && (
            <Fragment>
              <span style={{ marginTop: '1rem' }}>Back End: {uiBackendVersion.imageTag}</span>
              <span className={`${block}__revision`}>{uiBackendVersion.commit}</span>
            </Fragment>
          )}
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
);
