/*global require:false*/
import React from 'react/addons';
import Immutable from 'immutable';
import {IntlMixin} from 'react-intl';
import {combineLatest} from 'reactive-observables';
import {RouteHandler, Navigation} from 'react-router';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import QueryBuilder from 'in-components/QueryBuilder';
import ChoosePluginButton from 'in-components/ChoosePluginButton';
import * as constants from 'in-forge/constants';
import Lettering from 'in-components/Lettering';
import helpify from 'in-components/hoc/helpify';
import Sidebar from 'in-components/Sidebar';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import {create} from 'in-services/conveyer';
import Map from 'in-map';

import ConnectionStatus from './ConnectionStatus';
import FeedbackBadge from './FeedbackBadge';
import HelpDialog from './HelpDialog';
import DemoDialog from './DemoDialog';
import Settings from './Settings';
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
      pluginIds: [constants.plugins.os],
      showSettings: false
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

    const subscriptions = this.state.pluginIds.map(pluginId => {
      return create(SnapshotConveyer, {pluginId});
    });

    this.addSubscription(
      combineLatest(subscriptions).subscribe(snapshotArray => {
        const snapshots = snapshotArray.reduce((a, b) => a.concat(b), Immutable.List());
        if(snapshots.size === 0) {
          this.props.showHelp(203860032);
        } else {
          this.props.closeHelpIfOpen();
        }
      })
    );
  },

  togglePlugin(pluginIds) {
    this.setState({ pluginIds });
  },

  showMenu(show=true) {
    this.setState({ showSettings: show });
  },

  render() {
    const hasChildren = this.props.state.routes.length > 1;

    return (
      <div>
        {this.state.showSettings ?
          <Settings showMenu={this.showMenu}/> :
          null
        }

        <Lettering className='in-root-lettering' />

        {__DEV__ ?
          <QueryBuilder />
        : null}

        {__DEV__ ?
          <ChoosePluginButton onClick={this.togglePlugin}/>
        : null}

        <section style={{display: hasChildren ? 'none' : 'block'}}>
          <Map pluginIds={this.state.pluginIds} />
          <Sidebar pluginIds={this.state.pluginIds} />
          <FeedbackBadge />
        </section>

        <Footer showMenu={this.showMenu}/>

        <RouteHandler />

        {this.props.state.query.help ?
          <HelpDialog id={this.props.state.query.help} />
        : null}

        {window.instana.config.environment === 'demo' ?
          <DemoDialog />
        : null}

        <TooltipPresenter />

        <ConnectionStatus />
      </div>
    );
  }

});

export default helpify(App);
