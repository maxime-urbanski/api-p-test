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

import { Form } from "../../../components/location/Form";
import { PagedCollection } from "../../../types/collection";
import { Location } from "../../../types/Location";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getLocation = async (id: string | string[] | undefined) =>
  id ? await fetch<Location>(`/locations/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: location } = {} } = useQuery<
    FetchResponse<Location> | undefined
  >(["location", id], () => getLocation(id));

  if (!location) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{location && `Edit Location ${location["@id"]}`}</title>
        </Head>
      </div>
      <Form location={location} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["location", id], () => getLocation(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Location>>("/locations");
  const paths = await getItemPaths(
    response,
    "locations",
    "/locations/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
