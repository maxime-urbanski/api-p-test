import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getLocations,
  getLocationsPath,
} from "../../../components/location/PageList";
import { PagedCollection } from "../../../types/collection";
import { Location } from "../../../types/Location";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getLocationsPath(page), getLocations(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Location>>("/locations");
  const paths = await getCollectionPaths(
    response,
    "locations",
    "/locations/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
