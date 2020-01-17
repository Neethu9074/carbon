import { just } from 'reactive-observables';
import React from 'react';

import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import EntityWithType from 'in-new-components/EntityWithType';
import SvgIcon from 'in-components/SvgIcon';

export default {
  title: 'Molecules|EntityWithTypeAndIcon',
  component: EntityWithTypeAndIcon,
  subComponent: { EntityWithType, SvgIcon }
};

export const Default = () => {
  return <EntityWithTypeAndIcon label="My Service" type="Service" iconType="lib_application_service" />;
};

export const Link = () => {
  return (
    <EntityWithTypeAndIcon href$={just('/')} label="My Service" type="Service" iconType="lib_application_service" />
  );
};
