import React from 'react';

import ContainerInfoDialog from 'in-forge/plugins/docker/ContainerInfoDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { isEntityOnline } from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshot }) => ({ isOnline: isEntityOnline(snapshot.get('id')) }),

  function ContainerInfoButton({ snapshot, className, isOnline }) {
    const button = (
      <Button onClick={onClick} className={className} disabled={!isOnline}>
        Get Container Info
      </Button>
    );

    if (isOnline) {
      return <Tooltip content="Container info is always live.">{button}</Tooltip>;
    }

    return (
      <Tooltip content="Container info can only be retrieved for entities which are still under monitoring by Instana.">
        {button}
      </Tooltip>
    );

    function onClick() {
      if (isOnline) {
        setActiveDialog(<ContainerInfoDialog snapshot={snapshot} time={Date.now()} />);
      }
    }
  }
);
