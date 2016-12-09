import {combineLatest} from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DashboardLink from 'in-components/Link/DashboardLink';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './ExpandHierarchyIcon.less';


const block = 'in-expand-hierarchy-icon';

export default React.createClass({

  displayName: 'ExpandHierarchyIcon',

  propTypes: {
    hierarchy: irpt.list
  },

  getInitialState() {
    return {
      isExpanded: false
    };
  },

  render() {
    const isExpanded = this.state.isExpanded;

    return (
      <div className={`${block}__icon-wrapper`}>
        <SvgIcon className={`${block}__info-icon`}
                 onClick={this.onClick}
                 type={isExpanded ? 'triangle_down' : 'triangle_right'}
                 width={8}
                 height={8}
                 color='#172429' />
        {isExpanded ?
          <div className={block}>
            <Hierarchy hierarchy={this.props.hierarchy} />
          </div>
        : null}
      </div>
    );
  },

  onClick(e) {
    e.stopPropagation();
    this.setState({isExpanded: !this.state.isExpanded});
  }
});

const Hierarchy = connectTo(props => {
  return {
    snapshots: combineLatest(props.hierarchy.toArray().map(id => getSnapshot(id)))
  };
},
function Hierarchy({snapshots}) {
  if (!snapshots) {
    return null;
  }

  let imgClasses = `${block}__icon`;

  return (
    <ul className={`${block}__list`}>
      {snapshots.map(snapshot => {
        const icon = getIcon(snapshot);
        return (
          <li key={snapshot.get('id')}
              className={`${block}__item`}>
            <img src={icon}
                 alt='Icon for this type of entity.'
                 className={imgClasses} />
            <DashboardLink snapshotId={snapshot.get('id')}>
              {getLabel(snapshot)}
            </DashboardLink>
          </li>
        );
      })}
    </ul>
  );
});
