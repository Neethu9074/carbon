import React from 'react';

import UrlShortenerPrompt, { messageId } from 'in-services/urlShortener/UrlShortenerPrompt';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { urlShortenerEnabled } from 'in-services/featureFlags';
import { getSingle } from 'in-services/settings/settings';

export function showPrompt() {
  if (!urlShortenerEnabled) {
    return;
  }

  if (getSingle('promptForUrlShortener') === false) {
    return;
  }

  addMessage(
    {
      id: messageId,
      icon: 'lib_actions_interface_link',
      title: 'URL Shortener',
      content: <UrlShortenerPrompt />
    },
    messageId
  );
}
