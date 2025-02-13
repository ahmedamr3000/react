import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { TokenContext } from "../Context/tokenContext";

export default function Login() {
  function cssClasses(...classes) {
    return classes.join(" ");
  }

  const navigate = useNavigate();
  const { token, setToken } = useContext(TokenContext);
  const [error, seterror] = useState(null);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is Required"),
    password: Yup.string()
      .matches("^[A-Z][a-z0-9]{4,8}$", "pattern is not valid")
      .required("password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: login,
  });

  async function login(value) {
    try {
      seterror(null);

      const { data } = await axios.post(
        `http://localhost:4200/auth/login`,
        value
      );

      if (data?.status == 401) {
        alert(data.message);
      } else {
        window.localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/");
      }
    } catch (err) {
      seterror(err.response.data.message);
      console.log(err);
    }
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={cssClasses(" my-5", "w-50", "mx-auto")}
    >
      {error ? (
        <div className={cssClasses(" py-2", "text-danger", "mt-2")}>
          {error}
        </div>
      ) : (
        ""
      )}
      <div className={cssClasses("form-floating", " mb-3")}>
        <input
          type="email"
          name="email"
          className={cssClasses("form-control")}
          id="email"
          placeholder="email"
          value={formik.values.email}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <label htmlFor="email">Email address</label>
        {formik.touched.email && formik.errors.email ? (
          <div className={cssClasses(" py-2", "text-danger", "mt-2")}>
            {formik.errors.email}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className={cssClasses("form-floating", " mb-3")}>
        <input
          type="password"
          name="password"
          className={cssClasses("form-control")}
          id="password"
          placeholder="password"
          value={formik.values.password}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <label htmlFor="password">Password</label>

        {formik.touched.password && formik.errors.password ? (
          <div className={cssClasses(" py-2", "text-danger", "mt-2")}>
            {formik.errors.password}
          </div>
        ) : (
          ""
        )}
      </div>

      <button className={cssClasses(" btn", "btn-primary")} type="submit">
        Login
      </button>
    </form>
  );
}
