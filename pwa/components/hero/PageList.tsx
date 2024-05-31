import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Hero } from "../../types/Hero";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getHerosPath = (page?: string | string[] | undefined) =>
  `/heroes${typeof page === "string" ? `?page=${page}` : ""}`;
export const getHeros = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Hero>>(getHerosPath(page));
const getPagePath = (path: string) =>
  `/heros/page/${parsePage("heroes", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: heros, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Hero>> | undefined
  >(getHerosPath(page), getHeros(page));
  const collection = useMercure(heros, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Hero List</title>
        </Head>
      </div>
      <List heros={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
