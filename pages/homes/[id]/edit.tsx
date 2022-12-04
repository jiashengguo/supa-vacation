import { getSession } from 'next-auth/react';
import axios from 'axios';
import Layout from '@/components/Layout';
import ListingForm from '@/components/ListingForm';
import { prisma } from '@/lib/prisma';
import service from '@zenstackhq/runtime/server';
import { useHome } from '@zenstackhq/runtime/client';
import { array } from 'prop-types';
import { Home } from '@zenstackhq/runtime/types';

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const redirect = {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };

  // Check if the user is authenticated
  if (!session) {
    return redirect;
  }


  const homeId = context.params.id;
  const queryContext = { user: session?.user };
  const home = await service.home.get(queryContext, homeId, {
    select:{
      id:true,
      title:true,
      description:true,
      price:true,
      guests:true,
      beds:true,
      baths:true
    },
    where:{
      ownerId: queryContext.user.id
    }
  });
  if(!home)
  {
    return redirect;
  }

  return {
    props: JSON.parse(JSON.stringify(home)),
  };
}

const Edit = (home:Home) => {
  //@ZenStack update hook
  const { update} = useHome();
  const updateHome = (args) => update(home.id, args);

  return (
    <Layout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-xl font-medium text-gray-800">Edit your home</h1>
        <p className="text-gray-500">
          Fill out the form below to update your home.
        </p>
        <div className="mt-8">
          {home ? (
            <ListingForm
              initialValues={home}
              buttonText="Update home"
              redirectPath={`/homes/${home.id}`}
              onSubmit={updateHome}
            />
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
