/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import Controls from 'in-applications/FlowMap/components/Controls/Controls';
import Nodes from 'in-applications/FlowMap/components/Nodes/Nodes';

export default class OverlayReactComponentMounter {
  constructor(
    nodesReactComponentWrapper,
    serviceLocatorUid,
    expandNodeLeft,
    expandNodeRight,
    expandChildLeft,
    expandChildRight,
    loadMore
  ) {
    this.nodesReactComponentWrapper = nodesReactComponentWrapper;
    this.serviceLocatorUid = serviceLocatorUid;
    // Setting PRECISION to UNKNOWN by default
    this.resultPrecisionDetails = 'PRECISION_UNKNOWN';

    ReactDOM.render(
      <Fragment>
        <Nodes
          serviceLocatorUid={this.serviceLocatorUid}
          expandNodeLeft={expandNodeLeft}
          expandNodeRight={expandNodeRight}
          expandChildLeft={expandChildLeft}
          expandChildRight={expandChildRight}
          loadMore={loadMore}
        />
        <Controls serviceLocatorUid={this.serviceLocatorUid} resultPrecisionDetails={this.resultPrecisionDetails} />
      </Fragment>,
      this.nodesReactComponentWrapper
    );
  }

  updateResultPrecision(resultPrecision) {
    this.resultPrecisionDetails = resultPrecision;
  }

  dispose() {}
}
