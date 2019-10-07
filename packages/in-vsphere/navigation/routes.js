import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import VSphereMainView from 'promise-loader?global,vsphere!in-vsphere/VSphereMainView';

import { vsphere } from 'in-vsphere/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';

export default (
  <Fragment>
    <Route path={vsphere} component={createAsyncViewComponent(VSphereMainView)} />
  </Fragment>
);
