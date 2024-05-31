import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/hero/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Hero</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
