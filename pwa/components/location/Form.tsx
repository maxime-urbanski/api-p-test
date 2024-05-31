import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Location } from "../../types/Location";

interface Props {
  location?: Location;
}

interface SaveParams {
  values: Location;
}

interface DeleteParams {
  id: string;
}

const saveLocation = async ({ values }: SaveParams) =>
  await fetch<Location>(!values["@id"] ? "/locations" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteLocation = async (id: string) =>
  await fetch<Location>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ location }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Location> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveLocation(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Location> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteLocation(id), {
    onSuccess: () => {
      router.push("/locations");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!location || !location["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: location["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/locations"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {location ? `Edit Location ${location["@id"]}` : `Create Location`}
      </h1>
      <Formik
        initialValues={
          location
            ? {
                ...location,
              }
            : new Location()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/locations");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="location_name"
              >
                name
              </label>
              <input
                name="name"
                id="location_name"
                value={values.name ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.name && touched.name ? "border-red-500" : ""
                }`}
                aria-invalid={errors.name && touched.name ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="name"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="location_city"
              >
                city
              </label>
              <input
                name="city"
                id="location_city"
                value={values.city ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.city && touched.city ? "border-red-500" : ""
                }`}
                aria-invalid={errors.city && touched.city ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="city"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="location_state"
              >
                state
              </label>
              <input
                name="state"
                id="location_state"
                value={values.state ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.state && touched.state ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.state && touched.state ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="state"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="location_photo"
              >
                photo
              </label>
              <input
                name="photo"
                id="location_photo"
                value={values.photo ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.photo && touched.photo ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.photo && touched.photo ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="photo"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="location_availableUnits"
              >
                availableUnits
              </label>
              <input
                name="availableUnits"
                id="location_availableUnits"
                value={values.availableUnits ?? ""}
                type="number"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.availableUnits && touched.availableUnits
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.availableUnits && touched.availableUnits
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="availableUnits"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="location_wifi"
              >
                wifi
              </label>
              <input
                name="wifi"
                id="location_wifi"
                value={values.wifi ?? ""}
                type="checkbox"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.wifi && touched.wifi ? "border-red-500" : ""
                }`}
                aria-invalid={errors.wifi && touched.wifi ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="wifi"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="location_laundry"
              >
                laundry
              </label>
              <input
                name="laundry"
                id="location_laundry"
                value={values.laundry ?? ""}
                type="checkbox"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.laundry && touched.laundry ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.laundry && touched.laundry ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="laundry"
              />
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {location && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
