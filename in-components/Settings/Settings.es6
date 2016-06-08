import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {activeTheme as activeThemeObservable, availableThemes, setActiveTheme} from 'in-services/theme';
import {showSettings$, setSettingsVisibility} from 'in-stores/settings/visibility';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import SettingEntry from 'in-components/Settings/SettingEntry';
import {setIn, settingsStore} from 'in-services/settings';
import {askPermission} from 'in-services/notification';
import CheckBox from 'in-components/CheckBox';
import ComboBox from 'in-components/ComboBox';
import Button from 'in-components/Button';
import Slider from 'in-components/Slider';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './Settings.less';

const block = 'in-settings';

export default connectTo({
    showSettings: showSettings$
  }, React.createClass({
  displayName: 'Settings',

  mixins: [
    PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    showSettings: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return {
      inverseCheckboxChecked: false,
      excludeUnmonitoredHosts: null,
      antialiasValue: 'off',
      speedSliderValue: 1,
      activeTheme: null,
      experiments: false
    };
  },

  componentWillMount() {
    this.addSubscription(settingsStore.subscribe(data => {
      const desktopNotification = data.get('desktopNotification');
      const excludeUnmonitoredHosts = data.getIn(['map', 'excludeUnmonitoredHosts']);
      const direction = data.getIn(['map', 'scrollDirection']);
      const antialias = data.getIn(['map', 'antialias']);
      this.setState({
        inverseCheckboxChecked: direction === 1 ? false : true,
        speedSliderValue: data.getIn(['map', 'scrollSpeed']),
        antialiasValue: antialias ? antialias : 'off',
        desktopNotification: desktopNotification,
        excludeUnmonitoredHosts: excludeUnmonitoredHosts,
        experiments: data.get('experiments')
      });
    }));

    this.addSubscription(activeThemeObservable.subscribe(activeTheme => this.setState({
      activeTheme
    })));
  },

  render() {
    if (!this.props.showSettings) {
      return null;
    }

    return (
      <Dialog onClose={this.closeSettings}
              className={block + '__dialog'}>
          <Button onClick={this.closeSettings}
                  className={block + '__button-close'}>
            <Icon type={'delete'} className={block + '__button-close__icon'}/>
          </Button>

        <div className={block}>
          <div className={block + '__header'}>
            Settings
          </div>

          <SettingEntry>
            <SettingEntry.Header text={'Inverse scroll direction'} />
            <SettingEntry.Content>
              <CheckBox onClick={(e) => {
                         setIn(['map', 'scrollDirection'], e.target.checked ? -1 : 1);
                        }}
                        defaultChecked={this.state.inverseCheckboxChecked}/>
            </SettingEntry.Content>
          </SettingEntry>

          <SettingEntry>
            <SettingEntry.Header text={'Scroll speed'} />
            <SettingEntry.Content>
              <Slider onChange={(e) => setIn(['map', 'scrollSpeed'], e.target.value)}
                      min={0.1}
                      max={20}
                      value={this.state.speedSliderValue}/>
            </SettingEntry.Content>
          </SettingEntry>

          <SettingEntry>
            <SettingEntry.Header text={'Antialias'} />
            <SettingEntry.Content>
              <ComboBox onChange={this.antialiasChanged}
                        value={this.state.antialiasValue}>
                {'off'}
                {'browserAA'}
              </ComboBox>
            </SettingEntry.Content>
          </SettingEntry>

          {__DEV__ ?
            <SettingEntry>
              <SettingEntry.Header text={'Theme (requires browser refresh)'} />
              <SettingEntry.Content>
                <ComboBox onChange={e => setActiveTheme(e.target.value)}
                          value={this.state.activeTheme}>
                  {availableThemes.toArray()}
                </ComboBox>
              </SettingEntry.Content>
            </SettingEntry>
            : null
          }

          <SettingEntry>
            <SettingEntry.Header text='Enable Desktop Notifications' />
            <SettingEntry.Content>
              <CheckBox onClick={this.toggleDesktopNotifications}
                        defaultChecked={this.state.desktopNotification}/>
            </SettingEntry.Content>
            <SettingEntry.HelpText text={
                                  'Desktop notifications will pop up if the browser window is not active ' +
                                  'to keep you up to date about important messages.'} />
          </SettingEntry>

          <SettingEntry>
            <SettingEntry.Header text='Disable Unmonitored Hosts' />
            <SettingEntry.Content>
              <CheckBox onClick={this.toggleUnmonitoredNodes}
                        defaultChecked={this.state.excludeUnmonitoredHosts}/>
            </SettingEntry.Content>
            <SettingEntry.HelpText text={
                                  'Instana automatically detects open TCP connections to hosts which are not ' +
                                  'monitored by Instana. These hosts are visualized as unmonitored hosts on the map. ' +
                                  'You can disable them by checking this box.'} />
          </SettingEntry>

          <SettingEntry>
            <SettingEntry.Header text='Enable Experimental Features' />
            <SettingEntry.Content>
              <CheckBox onClick={this.toggleExperimentalFeatures}
                        defaultChecked={this.state.experiments}/>
            </SettingEntry.Content>
            <SettingEntry.HelpText text={
                                  'We are constantly working on new features. Check this box ' +
                                  'if you want to use experimential features.'} />
          </SettingEntry>
        </div>
      </Dialog>
    );
  },

  antialiasChanged(event) {
    const value = event.target.value;

    // sets AA true if on value other than 'none' was chosen
    setIn(['map', 'antialias'], value);
  },

  closeSettings() {
    setSettingsVisibility(false);
  },

  toggleUnmonitoredNodes() {
    setIn(['map', 'excludeUnmonitoredHosts'], !this.state.excludeUnmonitoredHosts);
  },

  toggleDesktopNotifications() {
    const isDesktopNotificationEnabled = this.state.desktopNotification;

    if (!isDesktopNotificationEnabled) {
      askPermission(allowed => {
        if (allowed) {
          setIn(['desktopNotification'], true);
        }
      });
    } else {
      setIn(['desktopNotification'], false);
    }
  },

  toggleExperimentalFeatures() {
    setIn(['experiments'], !this.state.experiments);
  }
}));
