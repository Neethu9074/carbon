import React from 'react';

import StickyNoteHoster from 'in-map/components/stickyNotes/StickyNoteHoster';
import TooltipHoster from 'in-map/components/tooltips/TooltipHoster';
import MapNoContentMessage from 'in-components/MapNoContentMessage';
import AsciiSceneGraph from 'in-map/SceneGraph/AsciiSceneGraph';
import { setCanvas, clear } from 'in-map/stores/indexStore';
import Controls from 'in-components/MapOverlayControls';
import { view$, types as views } from 'in-stores/view';
import EventSidebar from 'in-components/EventSidebar';
import MapSidebar from 'in-components/MapSidebar';
import MapNotes from 'in-components/MapNotes';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import 'in-map/Map.less';

const block = 'in-map';

export default connectTo(
  {
    view: view$
  },
  function MapHandler(props) {
    return (
      <div>
        <section>
          <AsciiMap view={props.view} />
          <Controls />
          <EventSidebar />
          <MapSidebar />
          <MapNotes />
        </section>
        {props.children}
      </div>
    );
  }
);

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

  getTitle() {
    switch (this.props.view) {
      case views.container:
        return 'Infrastructure Container Map';
      case views.logical:
        return 'Application Map';
      case views.physical:
        return 'Infrastructure Host Map';
      default:
        return 'Unknown view';
    }
  }

  render() {
    let className = block;

    return (
      <div>
        <Title title={this.getTitle()} />
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
