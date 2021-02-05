/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import { t } from 'in-i18n';
import React from 'react';

import TagFilterExpressionConfigurationWrapper from 'in-analyze/AnalyzeView/components/TagFilterExpressionConfigurationWrapper';
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import TagSelectorOverlay from 'in-new-components/TagSelectorOverlay/TagSelectorOverlay';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import QuickFilterBar from 'in-applications/creation/components/QuickFilterBar';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-new-components/overlays/Overlay';
import { Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';

import locals from './CreateApplicationFilterExpression.mless';

export default function CreateApplicationFilterExpression({
  form,
  selectedBlueprint,
  timeConfig,
  updateForm,
  blueprintCatalogResult
}) {
  const categories = blueprintCatalogResult.data?.tagTree.find(category => category.label === selectedBlueprint.type)
    .children;

  const tagFilterExpressionField = form.get('tagFilterExpression');

  return (
    <TagFilterExpressionConfigurationWrapper
      quickFilterBar={
        blueprintCatalogResult.data && (
          <QuickFilterBar
            curatedTagFilters={categories.map(category => (
              <Overlay
                key={category.label}
                content={TagSelectorOverlay}
                props={{
                  tagCatalog: {
                    tagTree: category.children
                  },
                  onChange: tag => addTagFilter(tag, tagFilterExpressionField.value, form, updateForm)
                }}
                align="bottomLeft"
                withoutWrapper
              >
                {({ toggle, isOpen, refSetter }) => (
                  <BarItem
                    timeConfig={timeConfig}
                    showArrow={category.children.length > 1}
                    onClick={
                      category.children.length === 1
                        ? () =>
                            addTagFilter(
                              { name: category.children[0].tagName },
                              tagFilterExpressionField.value,
                              form,
                              updateForm
                            )
                        : toggle
                    }
                    refSetter={refSetter}
                    active={isOpen}
                    isOpen={isOpen}
                  >
                    {category.label}
                  </BarItem>
                )}
              </Overlay>
            ))}
            hideClearFiltersButton
            withoutFiltersLabel
          />
        )
      }
      queryBuilder={
        <Li component="div" noAlternatingBg>
          <div className={locals.queryBuilder}>
            <div className={locals.queryBuilderExpression}>
              <CreateApplicationQueryBuilder
                value={tagFilterExpressionField.value}
                onChange={tagFilterExpression => setTagFilterExpression(tagFilterExpression, form, updateForm)}
              />
            </div>

            <HorizontalFlexWrapper>
              {tagFilterExpressionField.value.length > 0 && (
                <Button
                  kind="subtle"
                  icon="lib_openclose_cancel"
                  size="compact"
                  onClick={() => setTagFilterExpression([], form, updateForm)}
                >
                  {t('in-applications:buttonClear')}
                </Button>
              )}
            </HorizontalFlexWrapper>
          </div>
        </Li>
      }
    />
  );
}

function addTagFilter({ name }, tagFilterExpression, form, updateForm) {
  const addedTag = {
    type: 'TAG_FILTER',
    name,
    operator: 'EQUALS'
  };
  setTagFilterExpression(
    joinExpressions({
      expressions: [tagFilterExpression, addedTag]
    }),
    form,
    updateForm
  );
}

function setTagFilterExpression(tagFilterExpression, form, updateForm) {
  updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue(tagFilterExpression)));
}
