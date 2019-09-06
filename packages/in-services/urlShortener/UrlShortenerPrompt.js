import { withState, compose, pure } from 'recompose';
import { fromPromise, just } from 'reactive-observables';
import { get } from 'lodash';
import React from 'react';

import { addCopiedToClipboardMessage } from 'in-components/CopyToClipboard';
import CopyToClipboardButton from 'in-new-components/CopyToClipboardButton';
import { removeMessage } from 'in-components/MessageFlyout/stores/messages';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import { generateShortUrl } from 'in-services/urlShortener/api';
import { setSingle } from 'in-services/settings/settings';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

import locals from './UrlShortenerPrompt.mless';

const supportsAsyncClipboardApi = get(window, ['navigator', 'clipboard', 'writeText']);
export const messageId = 'url-shortener';

export default compose(
  withState('generate', 'setGenerate', false),
  // pure to avoid excessive save calls
  pure,
  connectTo(({ generate }) => {
    if (generate) {
      return {
        result: generateShortUrl(window.location.href)
          .filter(result => !result.progress.loading)
          .flatMap(result => {
            if (!result.data || !supportsAsyncClipboardApi) {
              return just(result);
            }

            return fromPromise(
              window.navigator.clipboard.writeText(result.data.shortUrl).then(() => true, () => false)
            ).map(successullyCopiedToClipboard => ({
              ...result,
              data: {
                ...result.data,
                successullyCopiedToClipboard
              }
            }));
          })
      };
    }

    return {};
  })
)(UrlShortenerPrompt);

function UrlShortenerPrompt(props) {
  const { generate, result } = props;
  if (generate) {
    if (result) {
      if (result.data) {
        if (result.data.successullyCopiedToClipboard) {
          addCopiedToClipboardMessage('URL copied to clipboard!');
          removeMessage(messageId);
          // continue to show the waiting indicator to avoid flashing new content
          return <Wait {...props} />;
        } else {
          return <Ready {...props} />;
        }
      } else if (result.errors.length > 0) {
        return <Error {...props} />;
      }
    }
    return <Wait {...props} />;
  }

  return <Ask {...props} />;
}

function Ask({ setGenerate }) {
  return (
    <div className={locals.wrapper}>
      <p>Generate a short URL to the current view in Instana?</p>

      <div className={locals.actions}>
        <Button
          kind="create"
          onClick={e => {
            // do not close the overlay
            e.stopPropagation();
            setGenerate(true);
          }}
        >
          Generate URL
        </Button>
        <Button
          kind="subtle"
          onClick={() => {
            removeMessage(messageId);
            setSingle('promptForUrlShortener', false);
          }}
        >
          {`Don't`} show this again
        </Button>
      </div>
    </div>
  );
}

function Wait() {
  return (
    <div className={locals.wrapper}>
      <InfiniteCircle width={300} height={100} customText="Generating short URL." className={locals.loadingIndicator} />
    </div>
  );
}

function Ready({ result }) {
  return (
    <div className={locals.wrapper}>
      <p>Your short URL is ready!</p>

      <div className={locals.actions}>
        <CopyToClipboardButton kind="primaryv2" getText={() => result.data.shortUrl}>
          Copy to Clipboard
        </CopyToClipboardButton>
      </div>
    </div>
  );
}

function Error() {
  return (
    <div className={locals.wrapper}>
      <p>Unfortunately short URL generation failed. Sorry! 🥺</p>
    </div>
  );
}
