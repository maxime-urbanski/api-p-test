import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Form } from "../../../components/hero/Form";
import { PagedCollection } from "../../../types/collection";
import { Hero } from "../../../types/Hero";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getHero = async (id: string | string[] | undefined) =>
  id ? await fetch<Hero>(`/heroes/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: hero } = {} } = useQuery<
    FetchResponse<Hero> | undefined
  >(["hero", id], () => getHero(id));

  if (!hero) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{hero && `Edit Hero ${hero["@id"]}`}</title>
        </Head>
      </div>
      <Form hero={hero} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["hero", id], () => getHero(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Hero>>("/heroes");
  const paths = await getItemPaths(response, "heroes", "/heros/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
