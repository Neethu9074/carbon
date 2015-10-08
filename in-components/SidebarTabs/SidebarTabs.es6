import irpt from 'react-immutable-proptypes';
import * as ro from 'reactive-observables';
import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import {getClassName} from 'in-services/react';
import * as wiring from 'in-services/wiring';
import * as views from 'in-services/views';

import enhance from '../hoc/enhance';
import Tab from './Tab';

import './SidebarTabs.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-tabs';

const alwaysEmptyArrayObservable = ro.create({emitLatestOnSubscribe: true});
alwaysEmptyArrayObservable.emit([]);

const SidebarTabs = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired,
    className: rpt.string,
    hierarchy: rpt.array
  },

  statics: {
    createObservables() {
      return {
        hierarchy: selectedSnapshotStore.selectedSnapshot.transform({
          emitLatestOnSubscribe: true,

          transform(snapshot) {
            if (!snapshot) {
              return alwaysEmptyArrayObservable;
            }
            return wiring.getAllStepsBetweenNodeAndLeaf(views.physical.hosts, snapshot);
          },

          shouldRetransform(prevSnapshot, snapshot) {
            // reference check works because of immutable objects
            return prevSnapshot !== snapshot;
          }
        })
      };
    }
  },

  render() {
    const hierarchy = this.props.hierarchy;
    if (!hierarchy) {
      return null;
    }

    const snapshot = this.props.snapshot;
    return (
      <ul className={getClassName(this, block)}>

        {hierarchy.map((child, index) => {
          const isSelected = snapshot && snapshot.get('id') === child.get('id');
          return (
            <Tab key={index}
                 className={this.props.className + '__tab'}
                 onClick={this.onClick}
                 isSelected={isSelected}>
              {child}
            </Tab>
          );
        })}

      </ul>
    );
  },

  onClick(item) {
    selectedSnapshotStore.select(item);
  }
});

export default enhance(SidebarTabs);
