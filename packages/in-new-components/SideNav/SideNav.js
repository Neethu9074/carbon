/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { on } from '@instana/observables';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { scrollIntoView } from 'in-services/util/dom';

import locals from './SideNav.mless';

export default class SideNav extends React.Component {
  static displayName = 'SideNav';

  state = { itemSelected: 0 };

  componentDidMount() {
    this.wheelSubscription = on(document, 'wheel', { passive: true })
      .throttle(400)
      .startWith(true)
      .subscribe(this.highlightCurrentItemOnManualScroll);
  }

  componentWillUnmount() {
    if (this.wheelSubscription) {
      this.wheelSubscription.dispose();
      this.wheelSubscription = null;
    }
  }

  render() {
    const { addRightSeparator, className, addLeftSeparator, navItems, renderPreIcon, renderPostIcon } = this.props;
    const setItemSelected = i => this.setState({ itemSelected: i });

    return (
      <nav
        className={classNames({
          [locals.container]: true,
          [className]: className,
          [locals.rightSeparator]: addRightSeparator,
          [locals.leftSeparator]: addLeftSeparator
        })}
      >
        <ul className={locals.list}>
          {navItems.map((navItem, i) => (
            <li
              key={i}
              className={classNames({
                [locals.item]: true,
                [locals.selected]: this.state.itemSelected === i
              })}
              onClick={() => {
                setItemSelected(i);
                this.onItemClicked(i, navItem);
              }}
            >
              <span className={locals.label}>
                {renderPreIcon && renderPreIcon(navItem, this.state.itemSelected === i)}
                {navItem.label}
                {renderPostIcon && renderPostIcon(navItem)}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  onItemClicked = (i, navItem) => {
    scrollIntoView(document.getElementById(navItem.scrollId), { behavior: 'smooth' });
  };

  highlightCurrentItemOnManualScroll = () => {
    const navItems = this.props.navItems
      .map((item, index) => {
        const element = document.getElementById(item.scrollId);
        const { top, height } = element.getBoundingClientRect();
        return { index, top, bottom: top + height };
      })
      .filter(item => item.bottom > 0);

    if (navItems.length === 0) {
      return this.setState({ itemSelected: 0 });
    }
    if (navItems.length === 1) {
      return this.setState({ itemSelected: navItems[0].index });
    }

    // bottom must be insight view
    const navItemsFullInView = navItems.filter(item => item.bottom < window.innerHeight);
    if (navItemsFullInView.length === 0) {
      return this.setState({ itemSelected: navItems[0].index });
    }

    this.setState({ itemSelected: navItemsFullInView[navItemsFullInView.length - 1].index });
  };
}

SideNav.propTypes = {
  addRightSeparator: PropTypes.bool,
  className: PropTypes.string,
  addLeftSeparator: PropTypes.bool,
  renderPreIcon: PropTypes.func,
  renderPostIcon: PropTypes.func,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      checked: PropTypes.bool
    })
  ).isRequired
};
