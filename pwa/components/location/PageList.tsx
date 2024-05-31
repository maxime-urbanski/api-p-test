import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Location } from "../../types/Location";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getLocationsPath = (page?: string | string[] | undefined) =>
  `/locations${typeof page === "string" ? `?page=${page}` : ""}`;
export const getLocations =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<Location>>(getLocationsPath(page));
const getPagePath = (path: string) =>
  `/locations/page/${parsePage("locations", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: locations, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Location>> | undefined
  >(getLocationsPath(page), getLocations(page));
  const collection = useMercure(locations, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Location List</title>
        </Head>
      </div>
      <List locations={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
