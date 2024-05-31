import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getHeros,
  getHerosPath,
} from "../../../components/hero/PageList";
import { PagedCollection } from "../../../types/collection";
import { Hero } from "../../../types/Hero";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getHerosPath(page), getHeros(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Hero>>("/heroes");
  const paths = await getCollectionPaths(
    response,
    "heroes",
    "/heros/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
