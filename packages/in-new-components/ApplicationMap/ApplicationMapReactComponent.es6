import { compose, defaultProps } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import { getTagFilterToUrlString, getTagFilterFromUrlString } from 'in-analyze/filterBuilder';
import { tagFilter as tagFilterMatrixParameter } from 'in-analyze/navigation/matrix';
import { isWebGLSupported, getWebGLCanvasContext } from 'in-map/services/webGL';
import ApplicationMap from 'in-new-components/ApplicationMap/ApplicationMap';
import { showHelp, closeHelpIfOpen } from 'in-stores/navigation/navigation';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import getServiceMap from 'in-subscription/application/getServiceMap';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { timeConfig$ } from 'in-stores/time/config';
import connect from 'in-hoc/connectTo';

import locals from './ApplicationMap.mless';

export default compose(
  defaultProps({
    replaceHistory: false
  }),
  withUrlDependingState({
    getPathSegment: () => '/map',
    getMatrixPrefix: () => 'applicationMap.',
    boundKeys: [tagFilterMatrixParameter, 'layouter', 'particles', 'traffic', 'sizingMetric'],
    getResettingProps: () => [],
    getInitialState: () => {
      const initialState = {
        layouter: 'force',
        particles: false,
        traffic: false,
        sizingMetric: null
      };
      initialState[tagFilterMatrixParameter] = [];
      return initialState;
    },
    reducerName: 'onChangeUrlProperties',
    getParsedUrlValues: values => {
      const urlFilters = values[tagFilterMatrixParameter];
      const tagFilter = getTagFilterFromUrlString(urlFilters);

      const objectToReturn = {
        layouter: values.layouter,
        particles: values.particles === 'true' ? true : false,
        traffic: values.traffic === 'true' ? true : false,
        sizingMetric: values.sizingMetric
      };
      objectToReturn[tagFilterMatrixParameter] = tagFilter;

      return objectToReturn;
    },
    getSerializedUrlValues: props => {
      const tagFilter = props[tagFilterMatrixParameter];
      const urlReadyTagFilter = getTagFilterToUrlString(tagFilter);

      const objectToStore = {
        layouter: props.layouter,
        particles: props.particles,
        traffic: props.traffic,
        sizingMetric: props.sizingMetric
      };
      objectToStore[tagFilterMatrixParameter] = urlReadyTagFilter;
      return objectToStore;
    }
  }),
  connect(props => ({
    result: timeConfig$.flatMap(
      timeConfig =>
        getServiceMap({
          filter: {
            timeConfig,
            // when we want to see all services, remove the application filter
            application: props.applicationId
          }
        }).nextFrame() // avoids firing the intermediate progress result if the subscription is re-used
    )
  }))
)(props => <ApplicationMapReactComponent {...props} />);

export const ApplicationMapReactComponent = getElementDimensions(
  class extends React.Component {
    static displayName = 'ApplicationMapReactComponent';

    componentDidMount() {
      this.initMap(this.props);
    }

    componentWillUpdate(nextProps) {
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
      const hasErrors = get(result, ['errors'], []).length > 0;

      let errorOrLoadingOverlay = null;
      if (isLoading || hasErrors) {
        errorOrLoadingOverlay = (
          <div className={locals.centerWrapper}>
            {isLoading && <InfiniteCircle />}
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
        showHelp('webglNotSupported');
      } else if (!this.webGlContext) {
        showHelp('webglNotInitialized');
      } else {
        closeHelpIfOpen('webglNotSupported');
        closeHelpIfOpen('webglNotInitialized');
      }
    };
  }
);
