import onClickOutside from 'react-onclickoutside';
import React, { Fragment } from 'react';

import NewUiClientVersionAvailable from 'in-new-components/MainNavigation/components/NewUiClientVersionAvailable';
import { click } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ViewSwitcher from 'in-new-components/MainNavigation/components/ViewSwitcher';
import classNames from 'classnames';
import { scrollToTop } from 'in-services/util/dom';

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
      this.timeoutHandle = setTimeout(() => this.setExpandedState(true), 500);
    };

    delayedCollapse = () => {
      this.disposeHandle();
      this.timeoutHandle = setTimeout(() => this.setExpandedState(false), 125);
    };

    setExpandedState = newState => {
      if (newState !== this.state.isExpanded) {
        scrollToTop(this.mainNavigation);

        this.setState({
          isExpanded: newState,
          expandedSubMenu: newState ? this.state.expandedSubMenu : null
        });
      }
    };

    onViewSwitched = (e, viewLabel) => {
      e.stopPropagation();
      this.disposeHandle();
      this.setExpandedState(false);
      this.setState({
        lastClickedViewLabel: viewLabel
      });
    };

    onMouseLeave = viewLabel => {
      if (this.state.lastClickedViewLabel !== viewLabel) {
        this.delayedExpand();
        this.setState({
          lastClickedViewLabel: null
        });
      }
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
        <Fragment>
          <div
            className={classNames({
              [locals.navigation]: true,
              [locals.expandedNavigation]: isExpanded
            })}
            onMouseLeave={this.delayedCollapse}
            onClick={() => {
              this.setState({ isExpanded: true });
              click();
            }}
            ref={nav => (this.mainNavigation = nav)}
          >
            <div className={locals.backPlane} onMouseEnter={this.disposeHandle} />
            <ViewSwitcher
              isExpanded={isExpanded}
              expandedSubMenu={expandedSubMenu}
              setExpandedSubMenu={view => this.setState({ expandedSubMenu: view })}
              onViewSwitched={this.onViewSwitched}
              onMouseEnter={this.delayedExpand}
              onMouseLeave={this.onMouseLeave}
            />
            <NewUiClientVersionAvailable isExpanded={isExpanded} />
          </div>
          {isExpanded && <div className={locals.background} />}
        </Fragment>
      );
    }
  }
);
