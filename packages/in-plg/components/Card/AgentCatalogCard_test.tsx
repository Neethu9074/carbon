/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import { getEntriesForFreeTrial } from 'in-plg/pages/onboarding/content';
import AgentCatalogCard from 'in-plg/components/Card/AgentCatalogCard';

const entities = getEntriesForFreeTrial();

describe('in-plg/components/Card/AgentCatalogCard', () => {
  entities.forEach(entity => {
    it(`Renders <AgentCatalogCard /> with parameters of "${entity.id}"`, () => {
      const title = entity.label;
      const icon = entity.icon;
      const content = entity.subTechnology?.label ?? '';
      const href = `/agents/onboarding/installation/${entity.id}`;

      const { getByText, container } = render(
        <AgentCatalogCard title={title} icon={icon} content={content} href={href} />
      );

      if (content) {
        expect(getByText(content)).toBeInTheDocument();
      }

      const svgElement = container.querySelector('svg') as SVGElement;
      expect(svgElement).toBeInTheDocument();

      expect(getByText(title)).toBeInTheDocument();
    });
  });
});
