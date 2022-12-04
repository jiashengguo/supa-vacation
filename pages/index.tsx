import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import service from '@zenstackhq/runtime/server';
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  // Check if user is authenticated
  const session = await getSession(context);
  const queryContext = { user: session?.user };
  // Get all homes
  const homes = await service.home.find(queryContext);
  // Pass the data to the Home page
  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
}

export default function Home({ homes = [] }) {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">
        Top-rated places to stay
      </h1>
      <p className="text-gray-500">
        Explore some of the best places in the world
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
}
