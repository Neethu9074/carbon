/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import type { Fetcher, FetcherParams, FetcherOpts } from '@graphiql/toolkit';
import { GraphQLError } from 'graphql/error/GraphQLError';
import React, { useState, useEffect } from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';

import { Button, TextInput, Form } from '@instana/carbon';
import { Stack } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-internal/thisUnit/GraphiQL/GraphiQLView.mless';

interface GraphiQLViewProps {
  defaultEndpoint?: string;
}

/**
 * Renders a GraphiQL: a playground like in postman or insomnia, providing a splitted screen with
 * one panel with a GraphQL query input text area and one panel with the query/operation result
 *
 * https://github.com/graphql/graphiql/tree/main/packages/graphiql#readme
 */
const GraphiQLView: React.FC<GraphiQLViewProps> = ({ defaultEndpoint = '/api/graphql' }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState(defaultEndpoint);
  const [inputEndpoint, setInputEndpoint] = useState(defaultEndpoint);

  // Test the endpoint when it changes or on initial load
  useEffect(() => {
    testEndpoint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  // Test if the endpoint is accessible
  const testEndpoint = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: '{ __schema { queryType { name } } }' })
      });

      if (!response.ok) {
        throw new Error(`GraphQL endpoint returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors.map((e: any) => e.message).join(', '));
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  const fetcher: Fetcher = async (graphQLParams: FetcherParams, _opts?: FetcherOpts) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(graphQLParams)
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed with status ${response.status}`);
      }

      return response.json();
    } catch (err) {
      const error = {
        message: err instanceof Error ? err.message : String(err)
      } as GraphQLError;

      return { errors: [error] };
    }
  };

  // Handle endpoint form submission
  const handleEndpointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEndpoint(inputEndpoint);
  };

  // Endpoint input form using Carbon components
  const EndpointForm = () => (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#f4f4f4',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Form onSubmit={handleEndpointSubmit}>
        <Stack direction="horizontal" align="center">
          <div style={{ flex: 1 }}>
            <TextInput
              id="endpoint-input"
              labelText={t('in-internal:thisUnit.graphiql.title')}
              value={inputEndpoint}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputEndpoint(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignSelf: 'flex-end' }}>
            <Button type="submit" kind="primary">
              {t('in-internal:thisUnit.graphiql.connect')}
            </Button>
          </div>
          {error && (
            <div style={{ display: 'flex', alignSelf: 'flex-end' }}>
              <Button kind="secondary" onClick={testEndpoint}>
                {t('in-internal:thisUnit.graphiql.retry')}
              </Button>
            </div>
          )}
        </Stack>
      </Form>
    </div>
  );

  if (loading) {
    return (
      <div>
        <EndpointForm />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Loading GraphiQL...</h2>
          <p>Testing connection to GraphQL endpoint: {endpoint}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <EndpointForm />
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Error connecting to GraphQL endpoint</h2>
          <p>{error}</p>
          <p>Endpoint: {endpoint}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={locals.layout}>
      <EndpointForm />
      <div className={locals.graphiql}>
        <GraphiQL fetcher={fetcher} defaultQuery={query} onEditQuery={setQuery} />
      </div>
    </div>
  );
};

export default GraphiQLView;
