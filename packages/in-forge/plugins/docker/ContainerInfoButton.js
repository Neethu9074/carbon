import React from 'react';

import ContainerInfoDialog from 'in-forge/plugins/docker/ContainerInfoDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { isEntityOnline } from 'in-stores/snapshot';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshot }) => ({ isOnline: isEntityOnline(snapshot.get('id')) }),

  function ContainerInfoButton({ snapshot, className, isOnline }) {
    const button = (
      <Button kind="primary" onClick={onClick} className={className} disabled={!isOnline}>
        Get Container Info
      </Button>
    );

    if (isOnline) {
      return <Tooltip content="Container info is always live.">{button}</Tooltip>;
    }

    return (
      <Tooltip content="Container info can only be retrieved for entities that are still under monitoring by Instana.">
        {button}
      </Tooltip>
    );

    function onClick() {
      if (isOnline) {
        addActiveDialog(<ContainerInfoDialog snapshot={snapshot} time={Date.now()} />);
      }
    }
  }
);
