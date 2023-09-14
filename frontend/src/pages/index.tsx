import React from "react";

import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

const Home = () => {
  return (
    <>
      <h1>home</h1>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ req: ctx.req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/products",
        permanent: false,
      },
    };
  }
};

export default Home;
