import React from 'react';
import Sidebar from '../components/Sidebar';
import Layout from '../components/Layout';
import Page from '../components/Page';
import Goodreads from '../components/Goodreads';
import { useSiteMetadata } from '../hooks';

const GoodreadsTemplate = () => {
  const { title, subtitle } = useSiteMetadata();

  return (
    <Layout title={`Reading List - ${title}`} description={subtitle}>
      <Sidebar />
      <Page title="Reading List">
        <Goodreads />
      </Page>
    </Layout>
  );
};

export default GoodreadsTemplate;