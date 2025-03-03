/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useLayoutEffect, useRef } from 'react';

import { useObservable } from '@instana/hooks';

import useOpenDashboardOnEntityDoubleClick from 'in-map/useOpenDashboardOnEntityDoubleClick';
import StickyNoteHoster from 'in-map/components/stickyNotes/StickyNoteHoster';
import { view$, types as views } from 'in-infrastructure/perspectives/view';
import useClearSelectedEventForInMap from 'in-map/useClearSelectedEvent';
import MapNoContentMessage from 'in-map/components/MapNoContentMessage';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import TooltipHoster from 'in-map/components/tooltips/TooltipHoster';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { getWebGLCanvasContext } from 'in-map/services/webGL';
import HelpDialog from 'in-components/helpSystem/HelpDialog';
import { setCanvas, clear } from 'in-map/stores/indexStore';
import { pageNames } from 'in-services/tracking/pageNames';
import { getSingle } from 'in-services/settings/settings';
import { isWebGLSupported } from 'in-map/services/webGL';
import { getSetting$ } from 'in-services/settings';
import SceneGraph from 'in-map/SceneGraph';
import Title from 'in-components/Title';
import 'in-map/stores/statisticsStore';
import { t } from 'in-i18n';

import locals from 'in-map/Map.mless';

export default function Map() {
  const antialias = useObservable(getAntiAliasObservable, []);
  const view = useObservable(view$, []);
  const adaptToDevicePixelRatio = getSingle('charts_adaptToDevicePixelRatio', true);
  const ref = useRef();

  useDisabledBodyScroll();
  useOpenDashboardOnEntityDoubleClick();
  useClearSelectedEventForInMap();

  useLayoutEffect(() => {
    if (!ref.current) {
      clear();
      return;
    }

    if (!isWebGLSupported()) {
      addActiveDialog(
        <HelpDialog
          title={t('in-applications:applicationMap.webglNotSupportedTitle')}
          markdownContent={t('in-applications:applicationMap.webglNotSupported')}
        />
      );
      return;
    }

    const canvas = ref.current;
    // the GPU is a shared resource and as such there are times when it might be taken away from the app.
    // examples: another page does something that takes the GPU too long and the browser
    // or the OS decides to reset the GPU to get control back. the event is called >>webglcontextlost<<
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    let webGlContext;
    try {
      webGlContext = getWebGLCanvasContext(canvas);
    } catch (e) {
      // Swallow: User visible messages are handled by following code block
    }

    if (!webGlContext) {
      addActiveDialog(
        <HelpDialog
          title={t('in-applications:applicationMap.webglNotInitializedTitle')}
          markdownContent={t('in-applications:applicationMap.webglNotInitialized')}
        />
      );
      return;
    }

    setCanvas(canvas);
    const sceneGraph = new SceneGraph(canvas, antialias, webGlContext, adaptToDevicePixelRatio);

    return () => {
      clear();
      sceneGraph.dispose();
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current?.canvas]);

  return (
    <div className={locals.map}>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.infrastructure,
          pageRootName: pageNames.infra_map
        }}
      />

      <Title title={getTitle(view)} />
      <canvas className={locals.canvas} ref={ref} />
      <StickyNoteHoster />
      <TooltipHoster />
      <MapNoContentMessage />
    </div>
  );
}

function getTitle(view) {
  switch (view) {
    case views.container:
      return t('in-map:infrastructureContainerMap');
    case views.physical:
      return t('in-map:infrastructureHostMap');
    default:
      return t('in-map:unknownView');
  }
}

function onLost(event) {
  event.preventDefault();
  addActiveDialog(
    <HelpDialog
      title={t('in-applications:applicationMap.webglNotSupportedTitle')}
      markdownContent={t('in-applications:applicationMap.webglNotSupported')}
    />
  );
}

function onRestored(event) {
  event.preventDefault();
  // at the point that this method is called the browser has reset all state
  // to the default WebGL state and all previously allocated resources are invalid.
  // so you need to re-create textures, buffers, framebuffers, renderbuffers, shaders, programs
  // and setup your state (clearColor, blendFunc, depthFunc, etc...)
  // to make it short... reload the page
  window.location.reload();
}

function getAntiAliasObservable() {
  return getSetting$('map_antialias');
}
