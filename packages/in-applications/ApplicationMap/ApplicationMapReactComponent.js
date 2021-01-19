/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import ServicesNoDataNotification from 'in-applications/lists/components/ServicesNoDataNotification';
import * as webglNotInitialized from 'in-services/util/canvas/help-articles/webglNotInitialized.mmd';
import * as webglNotSupported from 'in-services/util/canvas/help-articles/webglNotSupported.mmd';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { isWebGLSupported, getWebGLCanvasContext } from 'in-map/services/webGL';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import ApplicationMap from 'in-applications/ApplicationMap/ApplicationMap';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import getServiceMap from 'in-subscription/application/getServiceMap';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import getElementDimensions from 'in-hoc/getElementDimensions';
import HelpDialog from 'in-components/helpSystem/HelpDialog';
import { timeConfig$ } from 'in-stores/time/config';
import withUrlState from 'in-hoc/withUrlState';
import connect from 'in-hoc/connectTo';

import locals from './ApplicationMap.mless';

export default compose(
  withUrlState({
    bind: [
      {
        path: '/map',
        name: 'tagFilter',
        as: 'tagFilters',
        initialState: [],
        parser: buildJsonParser([]),
        serializer: buildJsonSerializer()
      },
      {
        path: '/map',
        name: 'layouter',
        as: 'layouter',
        initialState: 'flow'
      },
      {
        path: '/map',
        name: 'particles',
        as: 'particles',
        initialState: true,
        parser: v => v === 'true',
        serializer: String
      },
      {
        path: '/map',
        name: 'traffic',
        as: 'traffic',
        initialState: false,
        parser: v => v === 'true',
        serializer: String
      },
      {
        path: '/map',
        name: 'sizingMetric',
        as: 'sizingMetric',
        initialState: null
      }
    ],
    reducerName: 'onChangeUrlProperties'
  }),
  connect(({ traffic, applicationId, boundaryScope }) => ({
    result: timeConfig$.flatMap(
      timeConfig =>
        getServiceMap({
          filter: {
            timeConfig,
            // when we want to see all services, remove the application filter
            application: traffic ? null : applicationId,
            applicationBoundaryScope: boundaryScope
          }
        }).nextFrame() // avoids firing the intermediate progress result if the subscription is re-used
    )
  }))
)(props => {
  return (
    <WithEmptyStateFallback
      getHasDataToRender={() => getHasDataToRender(props)}
      FallbackComponent={ServicesNoDataNotification}
    >
      <ApplicationMapReactComponent {...props} />
    </WithEmptyStateFallback>
  );
});

export const ApplicationMapReactComponent = getElementDimensions(
  class extends React.Component {
    static displayName = 'ApplicationMapReactComponent';

    componentDidMount() {
      this.initMap(this.props);
    }

    UNSAFE_componentWillUpdate(nextProps) {
      if (!this.map || this.props.applicationId !== nextProps.applicationId) {
        return this.initMap(nextProps);
      }

      this.map.updateState(this.props, nextProps);
      this.map.setSize(nextProps.width, nextProps.customHeight || nextProps.height);
    }

    componentWillUnmount() {
      this.disposeMap();
    }

    initMap(props) {
      this.disposeMap();

      if (isWebGLSupported() && this.webGlContext) {
        this.map = new ApplicationMap({
          canvas: this.canvas,
          overlayReactComponent: this.overlayReactComponent,
          props
        });
        this.map.updateState(null, props);
        if (props.width) {
          this.map.setSize(props.width, props.customHeight || props.height);
        }
      } else {
        this.showHelpIfWebGLCantBeSetup();
      }
    }

    render() {
      const { result } = this.props;

      const isLoading = get(result, ['progress', 'loading'], false);
      const hasErrors = get(result, ['errors', 'length'], 0) > 0;

      let errorOrLoadingOverlay = null;
      if (isLoading || hasErrors) {
        errorOrLoadingOverlay = (
          <div className={locals.centerWrapper}>
            {isLoading && <LoadingIndicator text="Loading Data" />}
            {hasErrors && <NoDataAvailable text="An unexpected error occurred" />}
          </div>
        );
      }

      return (
        <div className={locals.wrapper}>
          <div className={locals.overlay} ref={overlay => (this.overlayReactComponent = overlay)} />
          <canvas
            className={locals.canvas}
            ref={canvas => {
              this.canvas = canvas;
              this.webGlContext = getWebGLCanvasContext(canvas);
            }}
          />
          {errorOrLoadingOverlay}
        </div>
      );
    }

    disposeMap = () => {
      if (this.map) {
        this.map.dispose();
        this.map = null;
      }
    };

    showHelpIfWebGLCantBeSetup = () => {
      if (!isWebGLSupported()) {
        addActiveDialog(<HelpDialog article={webglNotSupported} />);
      } else if (!this.webGlContext) {
        addActiveDialog(<HelpDialog article={webglNotInitialized} />);
      }
    };
  }
);

function getHasDataToRender({ traffic, applicationId, boundaryScope }) {
  return timeConfig$
    .flatMap(
      timeConfig =>
        getServiceMap({
          filter: {
            timeConfig,
            // when we want to see all services, remove the application filter
            application: traffic ? null : applicationId,
            applicationBoundaryScope: boundaryScope
          }
        }).nextFrame() // avoids firing the intermediate progress result if the subscription is re-used
    )
    .map(result => !result.data || (result.data.services && result.data.services.length > 0))
    .distinct();
}
