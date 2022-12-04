import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Grid from '@/components/Grid';


import service from '@zenstackhq/runtime/server';


export async function getServerSideProps(context) {
  // Check if user is authenticated
  const session = await getSession(context);
  // If not, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  //@ZenStack: queryContext parameter for passing in the current login user. 
  //Then service find API would guarantee to return the correct data obey access policies defined in ZModel.
  const queryContext = { user: session?.user };
  const homes = await service.home.find(queryContext, {where:{
    owner:session.user
  }});
  // Pass the data to the Homes component
  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
}

const Homes = ({ homes = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your listings</h1>
      <p className="text-gray-500">
        Manage your homes and update your listings
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
};

export default Homes;
