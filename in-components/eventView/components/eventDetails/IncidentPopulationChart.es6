import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import createTimelineRenderer from 'in-components/eventView/components/eventDetails/renderer/timelineCanvas';
import Section from 'in-components/eventView/components/eventDetails/Section';

import './IncidentPopulationChart.less';


const block = 'in-event-view-event-detail-chart';

export default React.createClass({

  displayName: 'IncidentPopulationChart',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    event: irpt.map.isRequired
  },

  componentDidMount() {
    this.renderer = createTimelineRenderer({
      container: this.refs.container,
      canvas: this.refs.canvas
    });
    this.renderer.setIncidentId(this.props.event.get('id'));
  },

  componentWillUnmount() {
    this.renderer.dispose();
  },

  componentDidUpdate(prevProps) {
    if (prevProps.event !== this.props.event) {
      this.renderer.setIncidentId(this.props.event.get('id'));
    }
  },

  render() {
    return (
      <Section>
        <div ref='container'
             className={block}>
          <canvas ref='canvas'
                  className={`${block}__canvas`} />
        </div>
      </Section>
    );
  }
});
