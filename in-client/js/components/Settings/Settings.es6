import React from 'react/addons';

import {activeTheme as activeThemeObservable, availableThemes, setActiveTheme} from 'in-services/theme';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {setIn, settingsStore} from 'in-services/settings';
import {askPermission} from 'in-services/notification';
import * as tracking from 'in-services/tracking';
import CheckBox from 'in-components/CheckBox';
import ComboBox from 'in-components/ComboBox';
import Button from 'in-components/Button';
import Slider from 'in-components/Slider';
import Dialog from 'in-components/Dialog';
import Icon from 'in-components/Icon';

import SettingEntry from './SettingEntry';

import './Settings.less';

const block = 'in-settings';

const Settings = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    showMenu: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      inverseCheckboxChecked: false,
      unmonitoredHosts: null,
      antialiasValue: 'off',
      speedSliderValue: 1,
      activeTheme: null,
      experiments: false
    };
  },

  componentWillMount() {
    this.addSubscription(settingsStore.subscribe(data => {
      const desktopNotification = data.getIn(['desktopNotification']);
      const unmonitoredHosts = data.getIn(['map', 'unmonitoredHosts']);
      const direction = data.getIn(['map', 'scrollDirection']);
      const antialias = data.getIn(['map', 'antialias']);
      this.setState({
        inverseCheckboxChecked: direction === 1 ? false : true,
        speedSliderValue: data.getIn(['map', 'scrollSpeed']),
        antialiasValue: antialias ? antialias : 'off',
        desktopNotification: desktopNotification,
        unmonitoredHosts: unmonitoredHosts,
        experiments: data.getIn(['experiments'])
      });
    }));

    this.addSubscription(activeThemeObservable.subscribe(activeTheme => {
      this.setState({activeTheme});
    }));
  },

  render() {
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
                      defaultValue={this.state.speedSliderValue}/>
            </SettingEntry.Content>
          </SettingEntry>

          <SettingEntry>
            <SettingEntry.Header text={'Antialias'} />
            <SettingEntry.Content>
              <ComboBox onChange={this.antialiasChanged}
                        defaultValue={this.state.antialiasValue}>
                {'off'}
                {'browserAA'}
                {'FXAA'}
              </ComboBox>
            </SettingEntry.Content>
          </SettingEntry>

          {__DEV__ ?
            <SettingEntry>
              <SettingEntry.Header text={'Theme (requires browser refresh)'} />
              <SettingEntry.Content>
                <ComboBox onChange={e => setActiveTheme(e.target.value)}
                          defaultValue={this.state.activeTheme}>
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
                        defaultChecked={this.state.unmonitoredHosts}/>
            </SettingEntry.Content>
            <SettingEntry.HelpText text={
                                  'Instana automatically detects open TCP connections to hosts which are not ' +
                                  'monitored by Instana. These hosts are visualized as unmonitored hosts on the map. ' +
                                  'You can disable them by checking this box.'} />
          </SettingEntry>

          <SettingEntry>
            <SettingEntry.Header text='Show experimental features' />
            <SettingEntry.Content>
              <CheckBox onClick={this.toggleExperimentalFeatures}
                        defaultChecked={this.state.experiments}/>
            </SettingEntry.Content>
          </SettingEntry>
        </div>
      </Dialog>
    );
  },

  antialiasChanged(event) {
    const value = event.target.value;

    // sets AA true if on value other than 'none' was chosen
    setIn(['map', 'antialias'], value);

    // track the event
    tracking.events.antialiasWasChosenInSettings();
  },

  closeSettings() {
    this.props.showMenu(false);
  },

  toggleUnmonitoredNodes() {
    setIn(['map', 'unmonitoredHosts'], !this.state.unmonitoredHosts);
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
});

export default Settings;
