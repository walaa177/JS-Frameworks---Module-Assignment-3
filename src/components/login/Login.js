import React from "react";
import { BASE_URL, TOKEN_PATH } from "../constans/api";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthContext from "../context/AuthContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ValidationError from "../ValidationError";

import axios from "axios";

const url = BASE_URL + TOKEN_PATH;

const schema = yup.object().shape({
  username: yup.string().required("Please enter your username"),
  password: yup.string().required("Please enter your password"),
});

export default function Login() {
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [auth, setAuth] = useContext(AuthContext);

  async function onSubmit(data) {
    setSubmitting(true);
    setLoginError(null);
    console.log(data);
    try {
      const response = await axios.post(url, data);
      console.log("koko");
      console.log(response);
      setAuth(response.data);
      window.location = "/admin";
    } catch (error) {
      console.log("error", error);
      setLoginError(error.toString());
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="contact-info">
        {loginError && <ValidationError>{loginError}</ValidationError>}
        <fieldset disabled={submitting}>
          <div className="contact-info-input">
            <input placeholder="Username" {...register("username")} />
            {errors.username && <ValidationError>{loginError}</ValidationError>}
          </div>

          <div className="contact-info-input">
            <input
              placeholder="Password"
              type="Password"
              {...register("password")}
            />
            {errors.password && <ValidationError>{loginError}</ValidationError>}
          </div>
          <button className="btn-info">
            {submitting ? "Loggin in..." : "Login"}
          </button>
        </fieldset>
      </Form>
    </>
  );
}
