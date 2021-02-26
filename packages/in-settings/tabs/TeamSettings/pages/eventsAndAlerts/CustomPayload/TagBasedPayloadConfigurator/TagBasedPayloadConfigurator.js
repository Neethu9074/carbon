/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useRef } from 'react';
import rpt from 'prop-types';
import { t } from 'in-i18n';

import TagBasedPayload from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayload';
import TagSelectorOverlay from 'in-new-components/TagSelectorOverlay/TagSelectorOverlay';
import LoadingIndicator from 'in-new-components/GroupingConfigurator/LoadingIndicator';
import { getTagCatalogOnce, enrichTagCatalog } from 'in-services/tags/tagCatalog';
import Overlay from 'in-new-components/overlays/Overlay';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import Button from 'in-new-components/Button';

import locals from './TagBasedPayloadConfigurator.mless';

export default function TagBasedPayloadConfigurator({
  value,
  tagFilterExpression,
  onChange,
  getTagCatalog,
  getSuggestions
}) {
  const timeConfig = useTimeConfig();
  const tagCatalogResult = useObservable(getTagCatalog({ timeConfig }), [getTagCatalog]);
  const autoFocus = useRef();

  const tagCatalog = tagCatalogResult?.data;
  if (!tagCatalog || !tagCatalog.tagsByName) {
    return <LoadingIndicator />;
  }

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
      withoutWrapper
    >
      {({ toggle, refSetter }) =>
        value?.tagName ? (
          <TagBasedPayload
            onChange={onChange}
            getSuggestions={getSuggestions}
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
  onChange: rpt.func.isRequired,
  value: rpt.shape({
    payloadTagEntity: rpt.string.isRequired,
    tagName: rpt.string.isRequired,
    secondLevelKey: rpt.string
  }),
  getTagCatalog: rpt.func.isRequired,
  getSuggestions: rpt.func.isRequired,
  tagFilterExpression: rpt.object
};

export function createTagBasedPayloadConfigurator({ getTagCatalog: originalGetTagCatalog, getSuggestions }) {
  const getEnrichedCatalog = props =>
    originalGetTagCatalog(props).map(result => {
      if (result.data) {
        return success(enrichTagCatalog(result.data));
      }
      return result;
    });
  const getTagCatalog = getTagCatalogOnce(getEnrichedCatalog);
  return {
    TagBasedPayloadConfigurator: function CreatedTagBasedPayloadConfigurator(props) {
      return <TagBasedPayloadConfigurator {...props} getTagCatalog={getTagCatalog} getSuggestions={getSuggestions} />;
    }
  };
}

// e.g. { tagName: 'kubernetes.pod.label', key: 'app' }
export const toViewModel = ({ tagName = '', key }) => {
  return {
    payloadTagEntity: tagName,
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
