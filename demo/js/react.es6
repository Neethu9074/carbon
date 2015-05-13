/* eslint-disable new-cap */
/* global rStats */

'use strict';

import React from 'react';
import logging from 'instalog';
import rStats from './lib/rStats';
import glStats from './lib/rStats.extras';
import Map from '../../src';
import eventBus from 'instana-ui-services/eventbus';

const App = React.createClass({
  render() {
    return <Map onClick={this.onClick} ref="map" />;
  },

  componentDidMount() {
    if (window.location.search.indexOf('stats') !== -1) {
      const container = document.createElement('div');
      container.id = 'stats';
      document.body.appendChild(container);

      let glS = new glStats.GlStats(this.refs.map.emitter);
      let tS = new glStats.ThreeStats(this.refs.map.scene.renderer);
      /*eslint-disable no-new*/
      new rStats.RStats(this.refs.map.emitter, {
        values: {
          frame: {
            caption: 'Total frame time (ms)',
            over: 16
          },
          fps: {
            caption: 'Framerate (FPS)',
            below: 30
          },
          calls: {
            caption: 'Calls (three.js)',
            over: 3000
          },
          raf: {
            caption: 'Time since last rAF (ms)'
          },
          rstats: {
            caption: 'rStats update (ms)'
          }
        },
        groups: [{
          caption: 'Framerate',
          values: ['fps', 'raf']
        }, {
          caption: 'Frame Budget',
          values: ['frame', 'texture', 'setup', 'render']
        }],
        plugins: [
          tS,
          glS
        ]
      });
    }
    /*eslint-enable no-new*/
  },

  onClick() {
    // console.log(arguments);
  }
});


export default function init() {
  const consoleAppender = new logging.ConsoleAppender();
  logging.addAppender(consoleAppender);

  setTimeout(() => {
    eventBus.emit('showMetrics', {
      metrics: ['memory.free.5000.mean']
    });
  }, 3000);

  React.render(
    <App/>,
    document.getElementById('map')
  );
}
