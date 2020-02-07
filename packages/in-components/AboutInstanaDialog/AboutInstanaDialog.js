import React from 'react';

import getUiBackendVersion from 'in-subscription/getUiBackendVersion';
import { graphPath } from 'in-stores/navigation/paths/mainPaths';
import { close } from 'in-components/DialogPresenter/store';
import { goToPath } from 'in-stores/navigation';
import Lettering from 'in-components/Lettering';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import { build } from 'in-services/config';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';

import locals from './AboutInstanaDialog.mless';

export default connectTo(
  {
    uiBackendVersion: getUiBackendVersion()
  },
  function AboutInstanaDialog({ uiBackendVersion }) {
    return (
      <Dialog
        title="About"
        onClose={close}
        customHeader={
          <div className={locals.header}>
            <SvgIcon className={locals.cancelIcon} type="lib_openclose_cancel" size="l" onClick={close} />
          </div>
        }
      >
        <div className={locals.wrapper}>
          <Lettering className={locals.lettering} />
          <div className={locals.row}>
            <span className={locals.key}>UI: {build.tag}</span>
            <span className={locals.value}>{build.revision}</span>
          </div>

          {uiBackendVersion && (
            <div className={locals.row}>
              <span className={locals.key}>Back End: {uiBackendVersion.imageTag}</span>
              <span className={locals.value}>{uiBackendVersion.commit}</span>
            </div>
          )}
          <Button
            kind="primaryv2"
            className={locals.button}
            onClick={() => {
              goToPath(graphPath);
              close();
            }}
          >
            Graph Showcase
          </Button>
        </div>
      </Dialog>
    );
  }
);
