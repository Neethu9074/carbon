import onClickOutside from 'react-onclickoutside';
import React from 'react';

import ViewSwitcher from 'in-new-components/MainNavigation/components/ViewSwitcher';
import Stan from 'in-new-components/MainNavigation/components/Stan';
import { evaluateClassNames } from 'in-services/util/classnames';
import { homePath } from 'in-stores/navigation/paths/mainPaths';
import { getView } from 'in-stores/navigation/navigation';
import Link from 'in-components/Link';

import locals from './MainNavigation.mless';

export default onClickOutside(
  class MainNavigation extends React.Component {
    static displayName = 'MainNavigation';

    constructor(props) {
      super(props);

      this.state = {
        isExpanded: false,
        expandedSubMenu: null
      };
    }

    handleClickOutside = () => {
      this.setExpandedState(false);
    };

    delayedExpand = () => {
      this.disposeHandle();
      this.timeoutHandle = setTimeout(() => this.setExpandedState(true), 3000);
    };

    delayedCollapse = () => {
      this.disposeHandle();
      this.timeoutHandle = setTimeout(() => this.setExpandedState(false), 700);
    };

    setExpandedState = newState => {
      if (newState !== this.state.isExpanded) {
        this.setState({
          isExpanded: newState,
          expandedSubMenu: newState ? this.state.expandedSubMenu : null
        });
      }
    };

    onViewSwitched = e => {
      e.stopPropagation();
      this.disposeHandle();
      this.setExpandedState(false);
    };

    disposeHandle = () => {
      if (this.timeoutHandle) {
        clearTimeout(this.timeoutHandle);
        this.timeoutHandle = null;
      }
    };

    componentWillUnmount() {
      this.disposeHandle();
    }

    shouldComponentUpdate(nextProps, nextState) {
      return nextState.isExpanded !== this.state.isExpanded || nextState.expandedSubMenu !== this.state.expandedSubMenu;
    }

    render() {
      const { isExpanded, expandedSubMenu } = this.state;

      return (
        <div
          className={evaluateClassNames({
            [locals.navigation]: true,
            [locals.expandedNavigation]: isExpanded
          })}
          onMouseEnter={this.delayedExpand}
          onMouseLeave={this.delayedCollapse}
          onClick={() => this.setState({ isExpanded: true })}
        >
          <Link href$={getView(homePath)} className={locals.lettering} onClick={e => e.stopPropagation()}>
            <Stan isExpanded={isExpanded} />
          </Link>
          <ViewSwitcher
            isExpanded={isExpanded}
            expandedSubMenu={expandedSubMenu}
            setExpandedSubMenu={view => this.setState({ expandedSubMenu: view })}
            onViewSwitched={this.onViewSwitched}
          />
        </div>
      );
    }
  }
);
