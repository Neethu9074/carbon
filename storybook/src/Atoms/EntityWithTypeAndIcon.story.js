import { just } from 'reactive-observables';
import React from 'react';

import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';

export default {
  title: 'Atoms|EntityWithTypeAndIcon',
  component: EntityWithTypeAndIcon
};

export const Default = () => {
  return <EntityWithTypeAndIcon label="My Service" type="Service" iconType="lib_application_service" />;
};

export const Link = () => {
  return (
    <EntityWithTypeAndIcon href$={just('/')} label="My Service" type="Service" iconType="lib_application_service" />
  );
};
