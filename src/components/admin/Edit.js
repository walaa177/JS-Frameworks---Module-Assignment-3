import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ValidationError from "../ValidationError";
import axios from "axios";
import { BASE_URL, TOKEN_PATH } from "../constans/api";
import AuthContext from "../context/AuthContext";
import { Container } from "react-bootstrap";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
});

export default function Edit() {
  const [page, setPage] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [fetchingPage, setFetchingPage] = useState(true);
  const [updatingPage, setUpdatingPage] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [auth, setAuth] = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  let { id } = useParams();

  const url = `wp/v2/pages/${id}`;

  useEffect(
    function () {
      async function getPage() {
        try {
          const response = await axios.get(BASE_URL + url);
          console.log("response", response.data);

          setPage(response.data);
        } catch (error) {
          console.log(error.response.data.data.status);
          if (error.response.data.data.status === 401) {
            setFetchError(
              "You are not allowed to see this page because its private"
            );
          } else {
            setFetchError(error.toString());
          }
          console.log("koko");
        } finally {
          setFetchingPage(false);
        }
      }

      getPage();
    },

    []
  );

  async function onSubmit(data) {
    setUpdatingPage(true);
    setUpdateError(null);
    setUpdated(false);

    console.log(data);

    try {
      console.log(auth);
      let token = auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.put(BASE_URL + url, data, config);
      console.log("response", response.data);
      setUpdated(true);
    } catch (error) {
      console.log("error", error);
      setUpdateError(error.toString());
    } finally {
      setUpdatingPage(false);
    }
  }

  if (fetchingPage) return <div>Loading...</div>;

  if (fetchError) return <div>{fetchError}</div>;

  return (
    <>
      <Container>
        <div className="text-center">
          <h1>Edit Page</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="contact-info">
          {updated && <div className="success">The post was updated</div>}

          {updateError && <ValidationError>{updateError}</ValidationError>}

          <fieldset disabled={updatingPage}>
            <div>
              <input
                placeholder="Title"
                {...register("title")}
                defaultValue={page.title.rendered}
                className="contact-info-input"
              />
              {errors.title && (
                <ValidationError>{errors.title.message}</ValidationError>
              )}
            </div>
            <div>
              <select
                {...register("status")}
                defaultValue={page.status}
                className="contact-info-select"
              >
                <option value="" defaultValue={page.status}>
                  status
                </option>
                <option defaultValue={page.status} value="publish">
                  Publish
                </option>
                <option defaultValue={page.status} value="private">
                  Private
                </option>
                <option defaultValue={page.status} value="draft">
                  Draft
                </option>
                <option defaultValue={page.status} value="future">
                  Future
                </option>
              </select>
            </div>

            <button className="btn-info">Update</button>
          </fieldset>
        </form>
      </Container>
    </>
  );
}
