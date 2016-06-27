import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {activeControl$, setActiveControl} from 'in-components/Filterbar/stores/filterbarActiveControl';
import {toggleTableViewVisibility, isTableVisible$} from 'in-components/tableView/stores/visibility';
import classnames from 'in-services/util/classnames';
import {getClassName} from 'in-services/react';
import {view$, types} from 'in-stores/view';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './Controls.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-controls';


const TableViewToggleButton = connectTo({
    isTableVisible: isTableVisible$,
    view: view$
  }, function TableViewToggleButton({isTableVisible, view, onChangeActiveControl}) {
    if (view !== types.physical) {
      return null;
    }

    let classes = block;
    if (isTableVisible) {
      classes += ' ' + block + '--visible';
    }

    return (
      <li className={classnames({
        [block + '__control-item']: true,
        [block + '__control-item--start-of-group']: true,
        [block + '__control-item--end-of-group']: true,
        [block + '__control-item--active']: isTableVisible,
        [block + '__control-item--enabled']: true
      })}>
        <Tooltip content='Switch between 3D view and tabular form.'
                 align={'leftMiddle'}>
          <Icon type='menue'
                className={classnames({
                  [block + '__control-icon']: true,
                  [block + '__control-icon--active']: isTableVisible,
                  [block + '__control-icon--enabled']: true
                })}
                onClick={() => {
                  toggleTableViewVisibility();

                  if (!isTableVisible) {
                    onChangeActiveControl(null);
                  }
                }}/>
        </Tooltip>
      </li>
    );
  }
);


const Controls = connectTo({
    activeControl: activeControl$
  },
  React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
      activeControl: rpt.string,
      className: rpt.string
    },

    render() {
      return (
        <nav className={getClassName(this, block)}>
          <ul className={block + '__control-list'}>

            {this.renderControlIcon('metrics', 'metrics', 'Show metrics.', true, true, false)}
            {this.renderControlIcon('tags', 'tags', 'Show tags.', true, false, true)}

            {__DEV__ ?
              this.renderControlIcon('system', 'mapStats', 'Show map rendering stats.', true)
            : null}

            <TableViewToggleButton onChangeActiveControl={setActiveControl} />
          </ul>
        </nav>
      );
    },

    renderControlIcon(icon, controlName, tooltip, enabled, start, end) {
      // Assign the click handler only when enabled to ensure that the Icon component
      // is automatically switching between a <button> and an simple <i> element.
      let clickHandler;
      if (enabled) {
        clickHandler = () => setActiveControl(controlName);
      }
      return (
        <li className={classnames({
          [block + '__control-item']: true,
          [block + '__control-item--active']: this.props.activeControl === controlName,
          [block + '__control-item--enabled']: enabled,
          [block + '__control-item--start-of-group']: start,
          [block + '__control-item--end-of-group']: end
        })}>
          <Tooltip content={tooltip}
                   align={'leftMiddle'}>
            <Icon type={icon}
                  className={classnames({
                    [block + '__control-icon']: true,
                    [block + '__control-icon--active']: this.props.activeControl === controlName,
                    [block + '__control-icon--enabled']: enabled
                  })}
                  onClick={clickHandler}/>
          </Tooltip>
        </li>
      );
    }
  })
);

export default Controls;
