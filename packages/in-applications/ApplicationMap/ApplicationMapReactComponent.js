/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { get } from 'lodash';

import { useObservable } from '@instana/hooks';

import ServicesNoDataNotification from 'in-applications/lists/components/ServicesNoDataNotification';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { isWebGLSupported, getWebGLCanvasContext } from 'in-map/services/webGL';
import ApplicationMap from 'in-applications/ApplicationMap/ApplicationMap';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import getServiceMap from 'in-subscription/application/getServiceMap';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import getElementDimensions from 'in-hoc/getElementDimensions';
import HelpDialog from 'in-components/helpSystem/HelpDialog';
import { pendingResult } from 'in-services/fixedObjects';
import { timeConfig$ } from 'in-stores/time/config';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from './ApplicationMap.mless';

const urlStateDefinition = {
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
  ]
};
export default function ApplicationMapReactComponentStateWrapper(props) {
  const { applicationId, boundaryScope } = props;

  const [urlState, onChangeUrlProperties] = useUrlState(urlStateDefinition);

  const result =
    useObservable(
      () =>
        timeConfig$.flatMap(
          timeConfig =>
            getServiceMap({
              filter: {
                timeConfig,
                // when we want to see all services, remove the application filter
                application: urlState.traffic ? null : applicationId,
                applicationBoundaryScope: boundaryScope
              }
            }).nextFrame() // avoids firing the intermediate progress result if the subscription is re-used
        ),
      [boundaryScope, applicationId, urlState.traffic]
    ) ?? pendingResult;

  return (
    <WithEmptyStateFallback
      getHasDataToRender={() => getHasDataToRender(props)}
      FallbackComponent={ServicesNoDataNotification}
    >
      <ApplicationMapReactComponent
        {...urlState}
        {...props}
        result={result}
        onChangeUrlProperties={onChangeUrlProperties}
      />
    </WithEmptyStateFallback>
  );
}

function ApplicationMapLifecycleHandler(props) {
  const { result, width, customHeight, height, layouter, particles, traffic, sizingMetric } = props;

  const [webGlContext, setWebGlContext] = useState(null);
  const [canvasNode, setCanvasNode] = useState(null);
  const [overlayNode, setOverlayNode] = useState(null);
  const canvasRef = useCallback(_canvasNode => {
    setCanvasNode(_canvasNode);
    setWebGlContext(getWebGLCanvasContext(_canvasNode));
  }, []);
  const overlayRef = useCallback(setOverlayNode, []);

  const [map, setMap] = useState(null);
  useEffect(() => {
    if (!map && webGlContext) {
      setMap(initMap({ ...props, map, canvasNode, overlayNode, webGlContext }));
    }
  }, [canvasNode, overlayNode, webGlContext]); // not passing props as deps is wanted here!

  const isLoading = get(result, ['progress', 'loading'], false);
  const hasErrors = get(result, ['errors', 'length'], 0) > 0;

  // resize effect
  useEffect(() => {
    if (map) {
      map.updateState({ result, layouter, particles, traffic, sizingMetric });
      map.setSize(width, customHeight || height);
    }
  }, [map, layouter, particles, traffic, sizingMetric, width, customHeight, height, result]);

  // clean up effect
  useEffect(() => {
    return () => {
      disposeCurrentMap(map);
    };
  }, [map]);

  return (
    <div className={locals.wrapper}>
      <div className={locals.overlay} ref={overlayRef} />
      <canvas className={locals.canvas} ref={canvasRef} />
      {(isLoading || hasErrors) && (
        <div className={locals.centerWrapper}>
          {isLoading && <LoadingIndicator text={t('in-applications:loadingData')} />}
          {hasErrors && <NoDataAvailable text={t('in-applications:UnexpectedErrorOccurred')} />}
        </div>
      )}
    </div>
  );
}

function initMap(props) {
  const { map, canvasNode, overlayNode, webGlContext } = props;
  disposeCurrentMap(map);

  if (isWebGLSupported() && webGlContext) {
    const newMap = new ApplicationMap({
      canvas: canvasNode,
      overlayReactComponent: overlayNode,
      props
    });
    newMap.updateState(props);
    if (props.width) {
      newMap.setSize(props.width, props.customHeight || props.height);
    }
    return newMap;
  } else {
    showHelpIfWebGLCantBeSetup(webGlContext);
  }
  return null;
}

function disposeCurrentMap(map) {
  if (map) {
    map.dispose();
  }
}

function showHelpIfWebGLCantBeSetup(webGlContext) {
  if (isWebGLSupported()) {
    addActiveDialog(
      <HelpDialog
        title={t('in-applications:applicationMap.webglNotSupportedTitle')}
        markdownContent={t('in-applications:applicationMap.webglNotSupported')}
      />
    );
  } else if (!webGlContext) {
    addActiveDialog(
      <HelpDialog
        title={t('in-applications:applicationMap.webglNotInitializedTitle')}
        markdownContent={t('in-applications:applicationMap.webglNotInitialized')}
      />
    );
  }
}

export const ApplicationMapReactComponent = getElementDimensions(ApplicationMapLifecycleHandler);

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
