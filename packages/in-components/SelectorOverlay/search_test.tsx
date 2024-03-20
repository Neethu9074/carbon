/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';
import React from 'react';

import { Options } from 'in-components/TagSelectorOverlay/TagSelectorOverlay';
import { search } from 'in-components/SelectorOverlay/search';

const nodes: Options[] = [
  {
    label: 'Root Level Leaf',
    description: 'Funky root leaf',
    icon: 'plugin:host',
    badge: null,
    breadcrumbAndLabel: <></>,
    keywords: '',
    tagName: '',
    children: []
  },
  {
    label: 'Root Level Node',
    description: 'Some description',
    icon: 'plugin:neo4j',
    badge: null,
    breadcrumbAndLabel: <></>,
    keywords: '',
    tagName: '',
    children: [
      {
        label: 'First Level Leaf',
        description: 'Some description',
        icon: 'plugin:docker',
        badge: null,
        breadcrumbAndLabel: <></>,
        keywords: '',
        tagName: '',
        children: []
      },
      {
        label: 'First Level Node',
        description: 'Some description',
        icon: 'plugin:mule',
        badge: null,
        breadcrumbAndLabel: <></>,
        keywords: 'firstLevelNode',
        tagName: '',
        children: [
          {
            label: 'Second Level Leaf',
            keywords: 'foobar',
            badge: null,
            breadcrumbAndLabel: <></>,
            tagName: '',
            children: []
          },
          {
            label: 'Second Level Node',
            description: 'Some description',
            icon: 'plugin:mule',
            badge: null,
            breadcrumbAndLabel: <></>,
            keywords: '',
            tagName: '',
            children: [
              {
                label: 'Third Level Leaf',
                description: 'Some description',
                keywords: 'fobar',
                badge: null,
                breadcrumbAndLabel: <></>,
                tagName: '',
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
];

const namespaceOptions: Options[] = [
  {
    label: 'uid',
    description: 'Kubernetes Namespace UID',
    keywords: 'Kubernetes namespace uid',
    badge: null,
    breadcrumbAndLabel: <></>,
    tagName: 'kubernetes.namespace.uid',
    children: []
  },
  {
    label: 'name',
    description: 'Kubernetes namespace name',
    keywords: 'Kubernetes namespace name',
    badge: null,
    breadcrumbAndLabel: <></>,
    tagName: 'kubernetes.namespace.name',
    children: []
  }
];

describe('in-components/SelectorOverlay/search', () => {
  it('should return the whole tree if the query is empty', () => {
    expect(search(nodes, '')).to.deep.equal(nodes);
  });

  it('should filter by label', () => {
    expect(search(nodes, 'third')).to.deep.equal([
      {
        badge: null,
        children: [],
        label: 'Third Level Leaf',
        description: 'Some description',
        keywords: 'fobar',
        tagName: '',
        breadcrumbAndLabel: <></>
      }
    ]);
  });

  it('should filter by description', () => {
    expect(search(nodes, 'FunKy')).to.deep.equal([
      {
        badge: null,
        children: [],
        label: 'Root Level Leaf',
        description: 'Funky root leaf',
        icon: 'plugin:host',
        keywords: '',
        tagName: '',
        breadcrumbAndLabel: <></>
      }
    ]);
  });
  it('should sort by relevance', () => {
    expect(search(namespaceOptions, 'namespace name')).to.deep.equal([
      {
        label: 'name',
        description: 'Kubernetes namespace name',
        keywords: 'Kubernetes namespace name',
        badge: null,
        breadcrumbAndLabel: <></>,
        tagName: 'kubernetes.namespace.name',
        children: []
      },
      {
        label: 'uid',
        description: 'Kubernetes Namespace UID',
        keywords: 'Kubernetes namespace uid',
        badge: null,
        breadcrumbAndLabel: <></>,
        tagName: 'kubernetes.namespace.uid',
        children: []
      }
    ]);
  });
  it('should not return elements with children', () => {
    expect(search(nodes, 'firstLevelNode')).to.deep.equal([]);
  });
});
