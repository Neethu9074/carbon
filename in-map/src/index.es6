'use strict';

import React from 'react/addons';
import {Navigation} from 'react-router';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import eventBus from 'in-services/eventbus';
import http from 'in-services/http';

import NotificationDialog from 'in-components/NotificationDialog';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {createLogger} from 'instalog';
import Scene from './Scene';

import './index.less';


const logger = createLogger('in-map.MapRC');

const MapRC = React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin,
    Navigation
  ],

  propTypes: {
    pluginId: React.PropTypes.any.isRequired
  },

  getInitialState() {
    return {isWebGLSupported: false, article: null};
  },

  componentWillMount() {
    this.loadArticle();
    this.setState({isWebGLSupported: this.isWebGLSupported()});
  },

  componentDidMount() {
    if(!this.state.isWebGLSupported) {
      return;
    }

    const parent = React.findDOMNode(this.refs.parent);
    this.scene = new Scene({
      parent,
      pluginId: this.props.pluginId
    });

    this.addSubscription(eventBus.on('openDashboard').subscribe((snapshot) => {
      this.openDashboard(snapshot);
    }));
  },

  componentWillUnmount() {
    this.scene.dispose();
  },

  focus(snapshotId) {
    this.scene.focus(snapshotId);
  },

  openDashboard(snapshot) {
    this.transitionTo(
      'dashboard',
      {
        pluginId: encodeURIComponent(snapshot.get('pluginId')),
        steadyId: encodeURIComponent(snapshot.get('steadyId')),
        hostId: encodeURIComponent(snapshot.get('hostId'))
      }
    );
  },

  loadArticle() {
    const id = 203889331;
    const url = 'https://instana.zendesk.com//api/v2/help_center/articles/' +
      id + '.json';
    http({method: 'GET', url})
    .then(response => {
      this.setState({
        article: response.body.article,
        error: null
      });
    }, err => {
      logger.error('Failed to retrieve article with id', id, 'from ZenDesk', err);
      this.setState({
        article: null,
        error: err
      });
    });
  },

  onNotificationDialogClosed() {
    this.setState({notificationDialogClosed: true});
  },

  render() {
    // if WebGL is supported, render the MapRC
    // else show a notification with a zendesk help text.
    // if this dialog was closed show nothing but the deepest darkness.

    if(this.state.isWebGLSupported) {
      return (<div className='in-map' ref='parent'/>);
    }

    if(this.state.notificationDialogClosed) {
      return null;
    }

    const article = this.state.article;
    if(article) {
    return (
      <NotificationDialog title={article.title}
                          onClose={this.onNotificationDialogClosed}>
        <div dangerouslySetInnerHTML={{__html: article.body}}></div>
      </NotificationDialog>);

    } else if (this.state.error) {
      return (
        <NotificationDialog title='Failed to load help text'
                            onClose={this.onNotificationDialogClosed}>
          <p>Failed to retrieve the given help article, sorry :(.</p>
        </NotificationDialog>
      );

    } else {
      return (<NotificationDialog title='Loading help text...'
                            onClose={this.onNotificationDialogClosed}>
          <LoadingIndicator />
        </NotificationDialog>
      );
    }
  },

  // https://www.khronos.org/webgl/wiki/FAQ
  // it is recommended that you check for success or failure to initialize.
  // if WebGL fails to initialize it is recommended you distinguish between failure
  // because the browser doesn't support WebGL and failure for some other reason.
  // if the browser does not support WebGL then the map will not be rendered.
  // you can determine if the browser supports WebGL by checking for the existence of WebGLRenderingContext.
  isWebGLSupported() {
    if (window.WebGLRenderingContext) {
      // browser supports WebGL but if the canvas.getContext('webgl') returns null
      // then WebGL failed for some reason other than user's browser (no GPU, out of memory, etc...)
      const canvas = document.createElement('canvas');
      if (canvas && this.getWebGLCanvasContext(canvas)) {
        // browser supports WebGL and initialization worked.
        return true;
      }
    }
    return false;
  },

  getWebGLCanvasContext(canvas) {
    //iterate the different WebGL context names and return the first hit, null if none
    const names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
    for (let i = 0; i < names.length; i++) {
      const context = canvas.getContext(names[i]);
      if(context) {
        return context;
      }
    }
    return null;
  }
});

export default MapRC;
