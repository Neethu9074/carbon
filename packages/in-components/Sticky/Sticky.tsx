/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import invariant from 'invariant';
import React from 'react';

import { create, Disposable } from '@instana/observables';
import { themes } from '@instana/design-tokens';

import { stickyWrapperClassName } from 'in-components/Sticky/scrolling';
import createSideEffectHook from 'in-hooks/createSideEffectHook';
import { debouncedResize$ } from 'in-services/browser';
import { getCoords } from 'in-services/util/dom';
import { t } from 'in-i18n';

import locals from './Sticky.mless';

interface StickyProps {
  header?: React.ReactElement;
  useFixedLayout?: boolean;
  contentWidth?: string;
  backgroundColor?: string;
  shouldWrapContentWithSection?: boolean;
}
export default class Sticky extends React.Component<StickyProps> {
  static displayName = 'Sticky';
  private order?: number;
  private header?: HTMLElement | null;
  private wrapper?: HTMLElement | null;
  private contentWrapper?: HTMLElement | null;
  private headerCoords?: ReturnType<typeof getCoords>;
  private headerHeight?: number;
  private headerWidth?: number;
  private resizeSubscription?: Disposable;
  private refreshSubscription?: Disposable;

  constructor(props: StickyProps) {
    super(props);

    if (__DEV__) {
      invariant(this.props.header !== undefined, 'A Header must be defined for Sticky component.');
    }
  }

  refresh$ = create();

  setOrder(order: number) {
    this.order = order;
    this.refresh$.emit(true);
  }

  setHeader(node: HTMLElement | null) {
    this.header = node;
    this.refresh$.emit(true);
  }

  setWrapper(node: HTMLElement | null) {
    this.wrapper = node;
    this.refresh$.emit(true);
  }

  setContentWrapper(node: HTMLElement | null) {
    this.contentWrapper = node;
    this.refresh$.emit(true);
  }

  makeSticky = () => {
    if (!this.wrapper || !this.header || !this.contentWrapper) {
      return;
    }
    this.wrapper.style.paddingTop = `0px`;
    this.header.style.position = `static`;
    this.header.style.width = 'auto';
    this.headerCoords = getCoords(this.header);

    this.headerHeight = this.header.clientHeight;
    this.headerWidth = this.header.clientWidth;

    this.header.style.position = `fixed`;
    this.header.style.top = `${this.headerCoords.top}px`;
    this.header.style.left = `${this.headerCoords.left}px`;
    this.header.style.width = `${this.headerWidth}px`;
    this.wrapper.style.paddingTop = `${this.headerHeight}px`;
    if (this.props.children) {
      // Sticky has header and children. On an ideal scenario, chindren must take the remaining height in the screen
      // If a Sticky is being used without chindren, don't set min-height for the child wrapper
      this.contentWrapper.style.minHeight = `${window.innerHeight - this.headerCoords.top - this.headerHeight}px`;
    }
    if (this.props.useFixedLayout) {
      const { contentWidth } = this.props;
      this.contentWrapper.style.position = 'fixed';
      if (contentWidth) this.contentWrapper.style.width = contentWidth;
    }

    if (this.order !== undefined && this.order >= 0) {
      this.header.style.zIndex = String(Number(themes.default.ids.zIndex.option.stickyHeader) - this.order);
    }

    if (this.props.backgroundColor) {
      this.wrapper.style.backgroundColor = this.props.backgroundColor;
    }
  };

  componentDidMount() {
    this.resizeSubscription = debouncedResize$.subscribe(() => this.refresh$.emit(true));
    this.refreshSubscription = this.refresh$.nextFrame().subscribe(this.makeSticky);
  }

  componentWillUnmount() {
    if (this.resizeSubscription) {
      this.resizeSubscription.dispose();
      this.resizeSubscription = undefined;
    }
    if (this.refreshSubscription) {
      this.refreshSubscription.dispose();
      this.refreshSubscription = undefined;
    }
  }

  render() {
    const { shouldWrapContentWithSection = true } = this.props;

    return (
      <section
        ref={r => this.setWrapper(r!)}
        className={classNames(stickyWrapperClassName, {
          [locals.stickyWrapper]: true
        })}
      >
        <Header setHeader={r => this.setHeader(r)} setOrder={o => this.setOrder(o)}>
          {this.props.header}
        </Header>
        {shouldWrapContentWithSection ? (
          <section aria-label={t('in-components:pageStructure.contentAriaLabel')} ref={r => this.setContentWrapper(r!)}>
            {this.props.children}
          </section>
        ) : (
          this.props.children
        )}
      </section>
    );
  }
}

const useSideEffect = createSideEffectHook<HeaderProps, HeaderProps[]>(
  propsList => propsList.reduce<HeaderProps[]>((result, prop) => [...result, prop], []),
  propList => {
    for (let i = 0, length = propList.length; i < length; i++) {
      const header = propList[i];
      header.setOrder(i);
    }
  }
);

interface HeaderProps extends React.PropsWithChildren<{}> {
  setHeader: (node: HTMLElement | null) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  setOrder: (order: number) => void;
}

function Header(props: HeaderProps) {
  useSideEffect(props);
  const { children, setHeader } = props;
  return <div ref={r => setHeader(r)}>{children}</div>;
}
