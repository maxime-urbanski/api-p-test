import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/location/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Location</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
