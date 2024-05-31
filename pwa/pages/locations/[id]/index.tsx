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

import { Show } from "../../../components/location/Show";
import { PagedCollection } from "../../../types/collection";
import { Location } from "../../../types/Location";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getLocation = async (id: string | string[] | undefined) =>
  id ? await fetch<Location>(`/locations/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: location, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<Location> | undefined>(["location", id], () =>
    getLocation(id)
  );
  const locationData = useMercure(location, hubURL);

  if (!locationData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Location ${locationData["@id"]}`}</title>
        </Head>
      </div>
      <Show location={locationData} text={text} />
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
  const paths = await getItemPaths(response, "locations", "/locations/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
