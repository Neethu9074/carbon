import irpt from 'react-immutable-proptypes';
import * as ro from 'reactive-observables';
import {Navigation} from 'react-router';
import React from 'react/addons';

import enhance from 'in-components/hoc/enhance';
import * as wiring from 'in-services/wiring';
import * as views from 'in-services/views';
import Icon from 'in-components/Icon';

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
    return (
      <div className={block}>
        <div className={block + '__back-to-map'}
             onClick={this.closeDashboard}>

          <Icon className={block + '__back-to-map__icon'}
                type={'arrow_left'}/>

          Back to map
        </div>
      </div>
    );
  },

  closeDashboard() {
    this.transitionTo('map');
  }
});

export default enhance(DashboardHeader);
