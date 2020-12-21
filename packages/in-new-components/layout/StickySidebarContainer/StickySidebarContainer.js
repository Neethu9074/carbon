import React from 'react';

import classNames from 'classnames';
import { Col, Row } from 'in-new-components/layout/Grid';
import { debouncedResize$ } from 'in-services/browser';

import locals from './StickySidebarContainer.mless';

// The sidebar has position: static (initial state)
const STATIC = 0;

// We are attaching the bottom of the sidebar to the bottom of the viewport while scrolling down.
const DRAGGING_DOWN = 1;

// We are attaching the top of the sidebar to the top of the viewport while scrolling up.
const DRAGGING_UP = 2;

// We keep the sidebar fixed in place relative to the body - that is, we do not drag the sidebar around while scrolling.
// (As a consequence, it will be moved relative to the viewport.)
const KEEP_ABSOLUTE_POSITION = 3;

export default class extends React.Component {
  static displayName = 'StickySidebarContainer';

  constructor(props) {
    super(props);
    this.state = { mode: STATIC, yOffset: null, sidebarTallerThanAvailableSpace: false, width: null };
    this.sidebarInnerRef = React.createRef();
  }

  componentDidMount() {
    this.sidebarInnerDomNode = this.sidebarInnerRef.current;
    if (this.props.stickySidebar) {
      this.initialSidebarTop = getAbsoluteTop(this.sidebarInnerDomNode);
      this.lastScrollTop = window.pageYOffset;
      this.onBrowserResize();
      this.resizeSubscription = debouncedResize$.subscribe(this.onBrowserResize);
      window.addEventListener('scroll', this.handleScroll, { passive: true, capture: false });
    }
  }

  componentWillUnmount() {
    if (this.props.stickySidebar) {
      window.removeEventListener('scroll', this.handleScroll);
      if (this.resizeSubscription) {
        this.resizeSubscription.dispose();
      }
    }
  }

  onBrowserResize = () => {
    // Remark: That we use this.initialSidebarTop for a number of height calculations actually hints at the fact that
    // these places should probably use the available visible height for the sidebar. Since we have no footer element,
    // this is essentially the same in our case. For a more generic solution we should fix these places.
    this.windowHeight = window.innerHeight;
    this.sidebarHeight = this.sidebarInnerDomNode.scrollHeight;
    const sidebarTallerThanAvailableSpace = this.sidebarHeight > this.windowHeight - this.initialSidebarTop;
    if (this.state.sidebarTallerThanAvailableSpace !== sidebarTallerThanAvailableSpace) {
      this.setState({ sidebarTallerThanAvailableSpace });
    }

    // Force the inner sidebar div to keep its width (actually, the width of the outer sidebar div. Otherwise, with
    // some layout modes (like, position: absolute) it would take 100vw width. The - 24 is for 12 px padding on both
    // sides.
    const sidebarWidth = this.sidebarInnerDomNode.parentNode.getBoundingClientRect().width;
    const parentRowWidth = this.sidebarInnerDomNode.parentNode.parentNode.getBoundingClientRect().width;
    this.setState({
      width: `${sidebarWidth - 24}px`,
      // If the windows is too narrow, the "display: flex; flex-wrap: wrap;" of the grid row kicks in, pushing the
      // content area _below_ the left sidebar. When this happens, we need to stop all sticky sidebar shenanigans.
      flexWrapIsActive: sidebarWidth >= parentRowWidth * 0.9
    });
  };

  handleScroll = () => {
    if (!this.sidebarInnerDomNode) {
      return;
    }

    const scrollTop = window.pageYOffset;
    const isScrollingDown = scrollTop > this.lastScrollTop;
    const isScrollingUp = scrollTop < this.lastScrollTop;
    this.lastScrollTop = scrollTop;

    if (!isScrollingDown && !isScrollingUp) {
      return;
    }

    const scrollBottom = scrollTop + this.windowHeight;

    const sidebarTop = getAbsoluteTop(this.sidebarInnerDomNode);
    if (this.hasBeenDraggingUp() && sidebarTop === this.initialSidebarTop) {
      // We have reached the top of the document again and can return to the inital state.
      this.setState({ mode: STATIC, yOffset: null });
      return;
    }

    if (isScrollingUp && scrollTop === 0 && this.state.mode === KEEP_ABSOLUTE_POSITION && this.state.yOffset < 0) {
      // Situation: We have a page where the sidebar is
      //   a) taller than the viewport, and
      //   b) taller than the main content.
      // The user has scrolled to the bottom once and is now scrolling up again. The sidebar is in mode
      // KEEP_ABSOLUTE_POSITION now. When the user reaches the top of the main content, the scrollTop (scroll position
      // with respect to the whole document) is 0, thus the browser will not allow scrolling any further up. But since
      // we moved the sidebar up relative to the main content when scrolling down, the top portion of the sidebar is still
      // off screen. Solution: Move the sidebar down smoothly to unstuck it and align the top of the sidebar with the
      // top of the main content again.
      this.unstuckSidebarSmoothly();
    }

    const sidebarBottom = sidebarTop + this.sidebarHeight;
    const shouldDragDown = isScrollingDown && scrollBottom >= sidebarBottom;
    const shouldDragUp = isScrollingUp && sidebarTop >= scrollTop + this.initialSidebarTop;

    if (shouldDragDown && !this.hasBeenDraggingDown()) {
      this.setState({ mode: DRAGGING_DOWN, yOffset: null });
    } else if (shouldDragUp && !this.hasBeenDraggingUp()) {
      this.setState({ mode: DRAGGING_UP, yOffset: null });
    } else if ((this.hasBeenDraggingDown() && isScrollingUp) || (this.hasBeenDraggingUp() && isScrollingDown)) {
      // We have been dragging the sidebar down until now and the user has just changed their scroll direction to up, or
      // we have been dragging the sidebar up until now and the user has just changed their scroll direction to down.
      // In both cases:
      // 1. calculate the current y-offset of the sidebar relative to the document body
      //    (sidebarTop - this.initialSidebarTop).
      // 2. fix the sidebar on its current y-offset
      this.setState({ mode: KEEP_ABSOLUTE_POSITION, yOffset: sidebarTop - this.initialSidebarTop });
    }
  };

  hasBeenDraggingDown() {
    return this.state.mode === DRAGGING_DOWN;
  }

  hasBeenDraggingUp() {
    return this.state.mode === DRAGGING_UP;
  }

  unstuckSidebarSmoothly() {
    if (this.state.yOffset < 0) {
      window.requestAnimationFrame(this.unstuckSidebarSmoothly.bind(this));
      this.setState({ yOffset: this.state.yOffset - this.state.yOffset / 10 });
    }
  }

  render() {
    const { sidebar, children, sidebarWidth = 2, stickySidebar } = this.props;
    const { mode, yOffset, sidebarTallerThanAvailableSpace, width, flexWrapIsActive } = this.state;
    return (
      <Row>
        <Col lg={sidebarWidth}>
          <div
            ref={this.sidebarInnerRef}
            className={classNames({
              [locals.static]: flexWrapIsActive || mode === STATIC,
              [locals.fixedToBottom]: !flexWrapIsActive && sidebarTallerThanAvailableSpace && mode === DRAGGING_DOWN,
              [locals.fixedToTop]:
                !flexWrapIsActive && ((!sidebarTallerThanAvailableSpace && mode !== STATIC) || mode === DRAGGING_UP),
              [locals.keepAbsolutePosition]: !flexWrapIsActive && mode === KEEP_ABSOLUTE_POSITION
            })}
            style={!flexWrapIsActive ? { top: yOffset ? `${yOffset}px` : null, width } : {}}
          >
            {sidebar}
          </div>
        </Col>
        <Col
          lg={12 - sidebarWidth}
          className={classNames({ [locals.rightColum]: true, [locals.minHeight]: stickySidebar })}
        >
          {children}
        </Col>
      </Row>
    );
  }
}

function getAbsoluteTop(element) {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  const clientTop = document.documentElement.clientTop || document.body.clientTop || 0;
  return Math.round(element.getBoundingClientRect().top + scrollTop - clientTop);
}
