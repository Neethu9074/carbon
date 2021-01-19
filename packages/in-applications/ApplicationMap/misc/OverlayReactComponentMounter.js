/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import LayoutingLoadingScreen from 'in-applications/ApplicationMap/components/LayoutingLoadingScreen';
import ConnectionTooltip from 'in-applications/ApplicationMap/components/Tooltips/ConnectionTooltip';
import SearchBar from 'in-applications/ApplicationMap/components/SearchBar';
import Controls from 'in-applications/ApplicationMap/components/Controls';
import Nodes from 'in-applications/ApplicationMap/components/Nodes';

export default class OverlayReactComponentMounter {
  constructor(nodesReactComponentWrapper, serviceLocatorUid, props) {
    this.nodesReactComponentWrapper = nodesReactComponentWrapper;
    this.serviceLocatorUid = serviceLocatorUid;

    ReactDOM.render(
      <Fragment>
        <Nodes {...props} serviceLocatorUid={serviceLocatorUid} />
        <LayoutingLoadingScreen serviceLocatorUid={serviceLocatorUid} />
        <Controls {...props} serviceLocatorUid={serviceLocatorUid} />
        <SearchBar serviceLocatorUid={serviceLocatorUid} />
        <ConnectionTooltip {...props} serviceLocatorUid={serviceLocatorUid} />
      </Fragment>,
      this.nodesReactComponentWrapper
    );
  }

  dispose() {}
}
