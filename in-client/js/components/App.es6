/*global require:false*/
import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import {RouteHandler, Navigation} from 'react-router';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import QueryBuilder from 'in-components/QueryBuilder';
import ChoosePluginButton from 'in-components/ChoosePluginButton';
import * as constants from 'in-forge/constants';
import Lettering from 'in-components/Lettering';
import helpify from 'in-components/hoc/helpify';
import {create} from 'in-services/conveyer';
import Map from 'in-map';

import ConnectionStatus from './ConnectionStatus';
import FeedbackBadge from './FeedbackBadge';
import HelpDialog from './HelpDialog';
import Sidebar from './Sidebar';
import Footer from './Footer';

import './App.less';

const rpt = React.PropTypes;

const App = React.createClass({
  mixins: [
    IntlMixin,
    SubscriptionMixin,
    React.addons.PureRenderMixin,
    Navigation
  ],

  propTypes: {
    state: rpt.object.isRequired,
    showHelp: rpt.func.isRequired,
    closeHelpIfOpen: rpt.func.isRequired
  },

  getInitialState() {
    return {
      selectedSnapshot: null,
      pluginIds: [constants.plugins.os]
    };
  },

  componentDidMount() {
    this.addSubscription(
      selectedSnapshotStore.selectedSnapshot.subscribe(selectedSnapshot => {
        this.setState({
          selectedSnapshot
        });
      })
    );

    this.addSubscription(create(SnapshotConveyer, {pluginId: this.state.pluginIds[0]})
      .subscribe(data => {
        if(data.size === 0) {
          this.props.showHelp(203860032);
        } else {
          this.props.closeHelpIfOpen();
        }
      })
    );
  },

  togglePlugin(pluginIds) {
    this.setState({pluginIds});
  },

  render() {
    const hasChildren = this.props.state.routes.length > 1;

    return (
      <div>
        <Lettering className='in-root-lettering' />

        {__DEV__ ?
          <QueryBuilder />
        : null}

        {__DEV__ ?
          <ChoosePluginButton onClick={this.togglePlugin}/>
        : null}

        <div style={{display: hasChildren ? 'none' : 'block'}}>
          <Map pluginIds={this.state.pluginIds} />
          <Sidebar pluginId={this.state.pluginIds[0]} />
          <FeedbackBadge />
        </div>

        <Footer />

        <RouteHandler />

        {this.props.state.query.help ?
          <HelpDialog id={this.props.state.query.help} />
        : null}

        {window.instana.config.environment === 'demo' ?
          <div>
            this.renderDemoDialog()
          </div>
        : null}

        <ConnectionStatus />
      </div>
    );
  },

  renderDemoDialog() {
    const DemoDialog = require('./DemoDialog');
    return <DemoDialog />;
  }
});

export default helpify(App);
