import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {setIn, settingsStore} from 'in-services/settings';
import {askPermission} from 'in-services/notification';
import * as tracking from 'in-services/tracking';
import {
  activeTheme as activeThemeObservable,
  availableThemes,
  setActiveTheme
} from 'in-services/theme';
import CheckBox from 'in-components/CheckBox';
import ComboBox from 'in-components/ComboBox';
import Button from 'in-components/Button';
import Slider from 'in-components/Slider';
import Dialog from 'in-components/Dialog';

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
      antialiasValue: 'off',
      speedSliderValue: 1,
      activeTheme: null
    };
  },

  componentWillMount() {
    this.addSubscription(settingsStore.subscribe(data => {
      const direction = data.getIn(['map', 'scrollDirection']);
      const antialias = data.getIn(['map', 'antialias']);
      const desktopNotification = data.getIn(['desktopNotification']);
      this.setState({
        inverseCheckboxChecked: direction === 1 ? false : true,
        speedSliderValue: data.getIn(['map', 'scrollSpeed']),
        antialiasValue: antialias ? antialias : 'off',
        desktopNotification: desktopNotification
      });
    }));

    this.addSubscription(activeThemeObservable.subscribe(activeTheme => {
      this.setState({activeTheme});
    }));
  },

  render() {
    return (
      <Dialog onClose={this.closeSettings}>
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

          <div className={block + '__section'}/>

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

          {__DEV__ ? <div className={block + '__section'}/> : null }

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

          <div className={block + '__section-end'}/>

          <div className={block + '__button-close--wrapper'}>
            <Button onClick={this.closeSettings}
                    className={block + '__button-close'}>
              {'Close'}
            </Button>
          </div>

        </div>
      </Dialog>
    );
  },

  antialiasChanged(event) {
    const value = event.target.value;

    // sets AA true if on value other than 'none' was chosen
    setIn(['map', 'antialias'], value);

    //track the event
    tracking.trackEvent(tracking.events.antialiasWasChosenInSettings);
  },

  closeSettings() {
    this.props.showMenu(false);
  },

  toggleDesktopNotifications(){
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
  }
});

export default Settings;
