/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { PreviewPill, Spacer } from '@instana/components';
import { Disposable, on } from '@instana/observables';

import { scrollIntoView } from 'in-services/util/dom';

import locals from './SideNav.mless';

export type NavItem = {
  scrollId: string;
  label: string;
  title: string | React.ReactNode;
  content: React.ReactNode;
  checked?: boolean;
  valid?: boolean;
  hidden?: boolean;
  titleToolTipText?: string;
  isBeta?: boolean;
  isPrivatePreview?: boolean;
  subTitle?: string;
};

interface SideNavProps {
  addRightSeparator?: boolean;
  className?: string;
  addLeftSeparator?: boolean;
  renderPreIcon?: (navItem: NavItem, selected: boolean) => ReactNode;
  renderPostIcon?: (navItem: NavItem) => ReactNode;
  navItems: NavItem[];
}

export default class SideNav extends React.Component<SideNavProps> {
  static displayName = 'SideNav';

  state = { itemSelected: 0 };
  wheelSubscription: Disposable | null | undefined;

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
    const setItemSelected = (i: number) => this.setState({ itemSelected: i });
    const getPreviewBadge = (isPrivatePreview: boolean | undefined) => {
      if (isPrivatePreview === undefined) return <PreviewPill />;

      if (isPrivatePreview) {
        return <PreviewPill privatePreview />;
      }
      return <PreviewPill />;
    };

    return (
      <nav
        className={classNames({
          [locals.container]: true,
          [className ?? '']: className,
          [locals.rightSeparator]: addRightSeparator,
          [locals.leftSeparator]: addLeftSeparator
        })}
      >
        <ul className={locals.list}>
          {navItems.map((navItem, i) => {
            if (navItem.hidden) return;
            return (
              <li
                key={i}
                className={classNames({
                  [locals.item]: true,
                  [locals.selected]: this.state.itemSelected === i
                })}
                onClick={() => {
                  setItemSelected(i);
                  this.onItemClicked(navItem);
                }}
              >
                <span className={locals.label}>
                  {renderPreIcon && renderPreIcon(navItem, this.state.itemSelected === i)}
                  {navItem.label}
                  {navItem.isBeta && <Spacer horizontal="xsmall" />}
                  {navItem.isBeta && getPreviewBadge(navItem.isPrivatePreview)}
                  {renderPostIcon && renderPostIcon(navItem)}
                </span>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  onItemClicked = (navItem: NavItem) => {
    scrollIntoView(document.getElementById(navItem.scrollId), { behavior: 'smooth' });
  };

  highlightCurrentItemOnManualScroll = () => {
    const navItems = this.props.navItems
      .filter(item => !item.hidden)
      .map(item => document.getElementById(item.scrollId))
      .filter(Boolean)
      .map((element, index) => {
        const { top, height } = element!.getBoundingClientRect();
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
