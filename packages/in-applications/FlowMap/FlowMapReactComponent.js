/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState, useRef } from 'react';

import MapOverlay from 'in-applications/FlowMap/misc/OverlayReactComponentMounter';
import { getWebGLCanvasContext, isWebGLSupported } from 'in-map/services/webGL';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import HelpDialog from 'in-components/helpSystem/HelpDialog';
import FlowMap from 'in-applications/FlowMap/FlowMap';
import usePrevious from 'in-hooks/usePrevious';
import { t } from 'in-i18n';

import locals from './FlowMap.mless';

export default function MapOverlayWrapper(props) {
  const { ref: resizeObserverRef, ...dimensions } = useResizeObserverCustom();
  return (
    <div className={locals.wrapper} ref={resizeObserverRef}>
      <FlowMapReactComponentWrapper {...props} {...dimensions} />
    </div>
  );
}

function FlowMapReactComponentWrapper(props) {
  const [flowMap, setFlowMap] = useState();

  const prevProps = usePrevious(props);

  const canvasNodeRef = useRef();
  const webGlContextRef = useRef();
  const overlayRef = useRef();

  const canvasRefSetter = _canvasNode => {
    canvasNodeRef.current = _canvasNode;
    webGlContextRef.current = getWebGLCanvasContext(_canvasNode);
  };

  useEffect(() => {
    showHelpIfWebGLCantBeSetup(webGlContextRef);
    setFlowMap(initFlowMap());
    if (flowMap && props.flowMapState) {
      flowMap?.updateState(props.flowMapState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // We ignore the deps here to use it as a "componentDidMount" life-cycle hook

  useEffect(() => {
    if (prevProps?.flowMapState && !props?.flowMapState) {
      disposeFlowMapIfPresent();
    } else if (!prevProps?.flowMapState && props?.flowMapState) {
      if (!flowMap) {
        setFlowMap(initFlowMap());
      }
      if (flowMap) {
        flowMap?.updateState(props?.flowMapState);
      }
    } else {
      const flowMapStateHasChanged = prevProps?.flowMapStateVersion !== props?.flowMapStateVersion;
      if (flowMapStateHasChanged) {
        if (!flowMap) {
          setFlowMap(initFlowMap());
        }
        if (flowMap) {
          flowMap?.updateState(props?.flowMapState);
        }
      }
    }

    if (
      prevProps?.width !== props.width ||
      prevProps?.height !== props.height ||
      prevProps?.customHeight !== props.customHeight
    ) {
      if (flowMap) {
        flowMap?.setSize(props.width, props.customHeight || props.height);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowMap, prevProps, props]); // We don't need the functions, so we keep them ignored for now.

  function initFlowMap() {
    if (isWebGLSupported() && webGlContextRef) {
      disposeFlowMapIfPresent();
      const newMap = new FlowMap({
        canvas: canvasNodeRef.current,
        overlayReactComponent: overlayRef.current,
        props
      });

      return newMap;
    }
  }

  function disposeFlowMapIfPresent() {
    if (flowMap) {
      flowMap?.dispose();
      setFlowMap(null);
    }
  }

  return (
    <React.Fragment>
      <MapOverlay
        serviceLocatorUid={flowMap?.serviceLocatorUid}
        resultPrecisionDetails={props?.flowMapState?.resultPrecisionDetails}
        {...props}
        ref={overlayRef}
      />
      <canvas className={locals.canvas} ref={canvasRefSetter} />
    </React.Fragment>
  );
}

function showHelpIfWebGLCantBeSetup(webGlContext) {
  if (!isWebGLSupported()) {
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
