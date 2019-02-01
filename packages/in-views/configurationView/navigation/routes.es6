import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import ConfigurationView from 'promise-loader?global,configView!in-views/configurationView/ConfigurationView';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { settingsBasePath } from 'in-views/configurationView/navigation/paths';

export default (
  <Fragment>
    <Route path={settingsBasePath} component={createAsyncViewComponent(ConfigurationView)} />
  </Fragment>
);
