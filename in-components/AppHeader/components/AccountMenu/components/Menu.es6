import rpt from 'prop-types';
import React from 'react';

import TenantUnitSwitcher from 'in-components/AppHeader/components/AccountMenu/components/TenantUnitSwitcher';
import { isOpen$, closeMenu } from 'in-components/AppHeader/components/AccountMenu/accountMenuStore';
import { toggleDevPanel } from 'in-components/DeveloperPanel/stores/visibilityStore';
import { configurationViewLink$ } from 'in-stores/navigation/configuration';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import throttleNextFrame from 'in-services/util/throttleNextFrame';
import AboutInstanaDialog from 'in-components/AboutInstanaDialog';
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { config, isOnPremise } from 'in-services/config';
import { webVrEnabled } from 'in-services/featureFlags';
import { goToGraph } from 'in-stores/navigation';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './Menu.less';

const block = 'in-account-menu';
const umpLink = `https://${config.butlerDomain}/ump/${config.tenant}/${config.tenantUnit}`;

export default connectTo(
  {
    isOpen: isOpen$
  },
  class extends React.Component {
    static displayName = 'Menu';

    static propTypes = {
      isOpen: rpt.bool
    };

    componentDidMount() {
      this.onMouseUp = throttleNextFrame(this.onMouseUp);
    }

    componentWillUnmount() {
      this.disposeListener();
    }

    render() {
      if (!this.props.isOpen) {
        this.disposeListener();
        return null;
      }

      this.registerListener();

      return (
        <section className={block} ref={menu => (this.menu = menu)}>
          <p className={block + '__account-name'}>
            Signed in as {window.instana.user.fullName}
          </p>

          <Link href={umpLink} className={block + '__account-menu-link'} onClick={closeMenu} external>
            Management Portal
            <SvgIcon type="chevron_right" height={10} color="#92a5ae" />
          </Link>

          <Separator />

          {!isOnPremise() ? [<TenantUnitSwitcher key="0" />, <Separator key="1" />] : null}

          <Link className={block + '__link'} href$={configurationViewLink$} onClick={closeMenu}>
            Settings
          </Link>

          {!isOnPremise()
            ? <Link className={block + '__link'} href="#" onClick={closeAndCall(showReleaseNotes)}>
                Release Notes
              </Link>
            : null}

          <Link className={block + '__link'} href="#" onClick={closeAndCall(goToGraph)}>
            Graph Showcase
          </Link>

          {webVrEnabled
            ? <Link className={block + '__link'} href="#/webVR/physical" external>
                WebVR Showcase
              </Link>
            : null}

          {__DEV__
            ? <Link className={block + '__link'} onClick={toggleDevPanel}>
                Developer Panel
              </Link>
            : null}

          <Link className={block + '__link'} href="https://docs.instana.com" onClick={closeMenu} target="_block">
            Documentation
          </Link>

          <Link className={block + '__link'} href="https://support.instana.com" onClick={closeMenu} target="_block">
            Support
          </Link>

          <Link className={block + '__link'} onClick={() => setActiveDialog(<AboutInstanaDialog />)}>
            About Instana
          </Link>

          <Separator />

          <form action="/auth/signOut" method="post">
            <button type="submit" className={block + '__signout'}>
              Sign Out
            </button>
          </form>
        </section>
      );
    }

    registerListener = () => {
      if (this.registered) {
        return;
      }

      // Delay listener registration. If we would do this synchronously,
      // we would receive the click event which opened this dialog and
      // the dialog would be immediately closed.
      setTimeout(() => {
        window.addEventListener('click', this.onMouseUp, false);
        this.registered = true;
      }, 0);
    };

    disposeListener = () => {
      if (!this.registered) {
        return;
      }
      window.removeEventListener('click', this.onMouseUp, false);
      this.registered = false;
    };

    onMouseUp = e => {
      // we are doing this asynchronously and the timepicker may already be gone
      if (!this.menu) {
        return;
      }

      const rect = this.menu.getBoundingClientRect();
      if (e.clientX > rect.right || e.clientX < rect.left || e.clientY < rect.top || e.clientY > rect.bottom) {
        // the click was donw outside this component so close it
        closeMenu();
      }
    };
  }
);

function Separator() {
  return <div className={block + '__separator'} />;
}

function closeAndCall(fn) {
  return e => {
    e.preventDefault();
    closeMenu();
    fn();
  };
}
