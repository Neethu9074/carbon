import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';

export default function AlertChannelDetails({ alertChannel }) {
  if (!alertChannel) {
    return null;
  }

  return fullyQualified[alertChannel.get('kind')].createDetails(alertChannel);
}
