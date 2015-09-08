import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';
import * as ro from 'reactive-observables';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import * as wiring from 'in-services/wiring';
import * as views from 'in-services/views';
import {getIcon} from 'in-sdk/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import Button from 'in-components/Button';
import Icon from 'in-components/Icon';
import HealthIcon from 'in-components/HealthIcon';
import ZoneTag from 'in-components/ZoneTag';
import enhance from 'in-components/hoc/enhance';

import './Header.less';

const alwaysNullObservable = ro.create({emitLatestOnSubscribe: true});
alwaysNullObservable.emit(null);

const block = 'in-dashboard-header';

const DashboardHeader = React.createClass({
  mixins: [React.addons.PureRenderMixin, Navigation],

  propTypes: {
    snapshot: irpt.map,
    parentCoordinates: irpt.map
  },

  statics: {
    createObservables(props) {
      if (!props.snapshot) {
        return {
          parentCoordinates: alwaysNullObservable
        };
      }

      return {
        parentCoordinates: wiring.getParentNode(views.physical.hosts, props.snapshot)
      };
    }
  },

  render() {
    const snapshot = this.props.snapshot;

    if (!snapshot) {
      return null;
    }

    return (
      <div className={block}>
        {this.props.parentCoordinates ?
          <Icon type='close'
                className={block + '__close'}
                onClick={() => selectedSnapshotStore.select(this.props.parentCoordinates)}/>
        : null}
        <img src={getIcon(snapshot)}
             alt='Snapshot icon'
             className={block + '__icon'}/>

        <div>
          <h1 className={block + '__label'}>
            {getLabel(snapshot)}
            <HealthIcon snapshot={snapshot}
                        className={block + '__health'}/>
            <ZoneTag snapshot={snapshot}
                     className={block + '__zone'}/>
          </h1>
          <p className={block + '__plugin-type'}>
            {getSingular(snapshot.get('pluginId'))}
          </p>
        </div>

        <Button type='button'
                kind='default'
                onClick={this.closeDashboard}
                className={block + '__back-to-map'}>
          Back to map
        </Button>
      </div>
    );
  },

  closeDashboard() {
    this.transitionTo('map');
  }
});

export default enhance(DashboardHeader);
