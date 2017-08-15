import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import StickyNoteHoster from 'in-map/components/stickyNotes/StickyNoteHoster';
import TooltipHoster from 'in-map/components/tooltips/TooltipHoster';
import MapNoContentMessage from 'in-components/MapNoContentMessage';
import AsciiSceneGraph from 'in-map/SceneGraph/AsciiSceneGraph';
import { setCanvas, clear } from 'in-map/stores/indexStore';
import Controls from 'in-components/MapOverlayControls';
import EventSidebar from 'in-components/EventSidebar';
import MapSidebar from 'in-components/MapSidebar';
import MapNotes from 'in-components/MapNotes';

import 'in-map/Map.less';

const block = 'in-map';

export default function MapHandler(props) {
  return (
    <div>
      <section>
        <AsciiMap />
        <Controls />
        <EventSidebar />
        <MapSidebar />
        <MapNotes />
      </section>
      {props.children}
    </div>
  );
}

class AsciiMap extends React.Component {
  static displayName = 'AsciiMap';

  componentDidMount() {
    const canvas = this.mainCanvas;
    setCanvas(canvas);
    this.sceneGraph = new AsciiSceneGraph(canvas);
  }

  componentWillUnmount() {
    clear();

    // null check everything which was created in componentDidMount
    if (this.sceneGraph) {
      this.sceneGraph.dispose();
    }
  }

  render() {
    let className = block;

    return (
      <div>
        <DashboardNavigationRoute />
        <div id="in-map" className={className}>
          <canvas
            className={`${block}__canvas`}
            ref={canvas => {
              this.mainCanvas = canvas;
            }}
          />
          <StickyNoteHoster />
          <TooltipHoster />
          <MapNoContentMessage />
        </div>
      </div>
    );
  }
}
