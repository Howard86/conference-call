import React, { FC } from 'react';
import dynamic from 'next/dynamic';
import { Heading } from '@chakra-ui/react';
import Layout from '@/components/Layout';

const AdminSession = dynamic(() => import('@/components/AdminSession'));

const AdminPage: FC = () => {
  return (
    <Layout title="Administration">
      <Heading>Administration</Heading>
      <AdminSession />
    </Layout>
  );
};

export default AdminPage;
