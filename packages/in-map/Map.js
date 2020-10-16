import React, { useLayoutEffect, useRef } from 'react';

import StickyNoteHoster from 'in-map/components/stickyNotes/StickyNoteHoster';
import { showHelp, closeHelpIfOpen } from 'in-stores/navigation/navigation';
import TooltipHoster from 'in-map/components/tooltips/TooltipHoster';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import MapNoContentMessage from 'in-components/MapNoContentMessage';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { getWebGLCanvasContext } from 'in-map/services/webGL';
import { setCanvas, clear } from 'in-map/stores/indexStore';
import { isWebGLSupported } from 'in-map/services/webGL';
import { view$, types as views } from 'in-stores/view';
import { getSetting$ } from 'in-services/settings';
import useObservable from 'in-hooks/useObservable';
import SceneGraph from 'in-map/SceneGraph';
import Title from 'in-components/Title';
import 'in-map/stores/statisticsStore';

import locals from 'in-map/Map.mless';

export default function Map() {
  const antialias = useObservable(getAntiAliasObservable, []);
  const view = useObservable(view$, []);
  const ref = useRef();

  useDisabledBodyScroll();

  useLayoutEffect(() => {
    if (!ref.current) {
      clear();
      return;
    }

    if (!isWebGLSupported()) {
      showHelp('webglNotSupported');
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
      showHelp('webglNotInitialized');
      return;
    }

    setCanvas(canvas);
    const sceneGraph = new SceneGraph(canvas, antialias, webGlContext);
    closeHelpIfOpen('webglNotInitialized');
    closeHelpIfOpen('webglcontextlost');
    closeHelpIfOpen('webglcontextrestored');

    return () => {
      clear();
      sceneGraph.dispose();
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
  }, [ref.current?.canvas]);

  return (
    <div className={locals.map}>
      <ViewTrackingMeta
        data={{
          productArea: 'Infrastructure',
          pageRootName: 'Infra Map'
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
      return 'Infrastructure Container Map';
    case views.physical:
      return 'Infrastructure Host Map';
    default:
      return 'Unknown view';
  }
}

function onLost(event) {
  event.preventDefault();
  showHelp('webglNotSupported');
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
