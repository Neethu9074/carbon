import React from 'react';

import createWorldMapController from 'in-new-components/WorldMap/worldMapController';
import getElementDimensions from 'in-hoc/getElementDimensions';
import AmMap from 'in-new-components/AmMap/ReactWrapper';

import locals from './WorldMap.mless';

export default getElementDimensions(
  class WorldMap extends React.Component {
    static displayName = 'WorldMap';

    onDidMount = ({ containerElement }) => {
      this.controller = createWorldMapController(containerElement, this.props);
      this.controller.updateData(this.props);
    };

    componentWillUnmount() {
      if (this.controller) {
        this.controller.dispose();
      }
    }

    componentDidUpdate(prevProps) {
      if (prevProps.timeConfig !== this.props.timeConfig || prevProps.tagFilters !== this.props.tagFilters) {
        if (this.controller) {
          this.controller.updateData(this.props);
        }
      }
    }

    render() {
      const height = this.props.height || this.props.customHeight;
      if (!height) {
        return <div className={locals.wrapper} />;
      }

      return (
        <div className={locals.wrapper}>
          <AmMap onDidMount={this.onDidMount} height={`${height}px`} />
        </div>
      );
    }
  }
);
