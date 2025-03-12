/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef } from 'react';
import rpt from 'prop-types';

import { Message, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';

import TagBasedPayloadView from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadView';
import TagBasedPayload from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayload';
import { hasError, success, successObservableFactory } from 'in-services/util/result';
import TagSelectorOverlay from 'in-components/TagSelectorOverlay/TagSelectorOverlay';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import LoadingIndicator from 'in-components/GroupingConfigurator/LoadingIndicator';
import { getTagCatalogOnce, enrichTagCatalog } from 'in-services/tags/tagCatalog';
import Overlay from 'in-components/overlays/Overlay';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator.mless';

export default function TagBasedPayloadConfigurator({
  value,
  disabled,
  tagFilterExpression,
  onChange,
  getTagCatalog,
  suggestionsAlignedLeft,
  getSuggestions,
  // temporary solution
  inSidePanel = false,
  hideDestinationSourceTag = false
}) {
  const timeConfig = useTimeConfig();
  const tagCatalogResult = useObservable(getTagCatalog({ timeConfig }), [getTagCatalog]);
  const autoFocus = useRef();

  if (hasError(tagCatalogResult)) {
    return <ErroneousResultPresenter errors={tagCatalogResult.errors} />;
  }

  const tagCatalog = tagCatalogResult?.data;
  if (!tagCatalog || !tagCatalog.tagsByName) {
    return <LoadingIndicator />;
  }

  const tagPath = tagCatalog.tagsByName[value.tagName];

  return (
    <Overlay
      content={TagSelectorOverlay}
      props={{
        tagCatalog,
        showTypeBadge: true,
        onChange: ({ name }) => {
          autoFocus.current = Date.now();
          const tagTreeNode = tagCatalog.tagsByName[name];
          if (doesTagNodeNeedSecondLevelKey(tagTreeNode)) {
            onChange({ tagName: name, secondLevelKey: '' });
          } else {
            onChange({ tagName: name });
          }
        }
      }}
      align="bottomLeft"
      inSidePanel={inSidePanel}
      withoutWrapper
    >
      {({ toggle, refSetter }) =>
        disabled ? (
          tagPath ? (
            <TagBasedPayloadView
              tagCatalog={tagCatalog}
              payloadValue={value}
              hideDestinationSourceTag={hideDestinationSourceTag}
              doesTagNodeNeedSecondLevelKey={doesTagNodeNeedSecondLevelKey(tagPath)}
            />
          ) : (
            <Message type="error" small>
              {t('in-settings:tabs.team.customPayload.unknownTag', { tagName: value?.tagName })}
            </Message>
          )
        ) : value?.tagName ? (
          <TagBasedPayload
            onChange={onChange}
            getSuggestions={getSuggestions}
            suggestionsAlignedLeft={suggestionsAlignedLeft}
            payload={value}
            toggle={toggle}
            ref={refSetter}
            tagName={value.tagName}
            tagTreeNode={tagCatalog.tagsByName[value.tagName]}
            tagFilterExpression={tagFilterExpression}
            autoFocus={autoFocus.current}
          />
        ) : (
          <Button
            className={locals.selectPayloadButton}
            kind="action"
            size="compact"
            refSetter={refSetter}
            onClick={toggle}
          >
            {t('in-settings:tabs.selectTag')}
          </Button>
        )
      }
    </Overlay>
  );
}

TagBasedPayloadConfigurator.propTypes = {
  onChange: rpt.func,
  value: rpt.shape({
    payloadTagEntity: rpt.string,
    tagName: rpt.string.isRequired,
    secondLevelKey: rpt.string
  }),
  disabled: rpt.bool,
  getTagCatalog: rpt.func.isRequired,
  getSuggestions: rpt.func.isRequired,
  suggestionsAlignedLeft: rpt.bool,
  tagFilterExpression: rpt.object,
  hideDestinationSourceTag: rpt.bool,
  inSidePanel: rpt.bool
};

export function createTagBasedApplicationPayloadConfigurator({ getTagCatalog, getSuggestions }) {
  return createTagBasedPayloadConfigurator({ getTagCatalog, getSuggestions });
}

export function createTagBasedWebsitePayloadConfigurator({ getTagCatalog, getSuggestions }) {
  return createTagBasedPayloadConfigurator({ getTagCatalog, getSuggestions });
}

export function createTagBasedMobileAppPayloadConfigurator({ getTagCatalog, getSuggestions }) {
  return createTagBasedPayloadConfigurator({ getTagCatalog, getSuggestions });
}

export function createTagBasedInfraPayloadConfigurator({ getTagCatalog, getSuggestions }) {
  return createTagBasedPayloadConfigurator({ getTagCatalog, getSuggestions });
}

export function createTagBasedPayloadConfigurator({
  getTagCatalog: originalGetTagCatalog,
  getSuggestions: optionalOriginalGetSuggestions
}) {
  const getEnrichedCatalog = props =>
    originalGetTagCatalog(props).map(result => {
      if (result.data) {
        return success(enrichTagCatalog(result.data));
      }
      return result;
    });
  const getTagCatalog = getTagCatalogOnce(getEnrichedCatalog);

  const getEmptySuggestions = successObservableFactory({
    suggestions: [],
    results: [],
    totalHits: 0
  });

  const getSuggestions = optionalOriginalGetSuggestions ?? getEmptySuggestions;

  return function TagBasedPayloadConfiguratorWithCatalog(props) {
    return <TagBasedPayloadConfigurator {...props} getTagCatalog={getTagCatalog} getSuggestions={getSuggestions} />;
  };
}

// e.g. { tagName: 'kubernetes.pod.label', key: 'app' }
export const toViewModel = ({ tagName = '', key }) => {
  return {
    tagName,
    secondLevelKey: key
  };
};

export const toFormModel = viewModel => ({
  tagName: viewModel.tagName,
  key: viewModel.secondLevelKey
});

export function doesTagNodeNeedSecondLevelKey(tagTreeNode) {
  return tagTreeNode?.type === 'KEY_VALUE_PAIR';
}
