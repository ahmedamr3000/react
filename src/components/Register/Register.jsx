import axios from "axios";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { TokenContext } from "../Context/tokenContext";

export default function Register() {
  function cssClasses(...classes) {
    return classes.join(" ");
  }
  const [error, seterror] = useState(null);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    repassword: "",
  };
  const navigate = useNavigate();
  const { token, setToken } = useContext(TokenContext);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "min length is 3 characters")
      .max(10, "max length is 15 character")
      .required("Username is required"),
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is Required"),
    password: Yup.string()
      .matches("^[A-Z][a-z0-9]{4,8}$", "pattern is not valid")
      .required("password is required"),
    repassword: Yup.string()
      .oneOf([Yup.ref("password")])
      .required("confirm password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: signUp,
  });

  async function signUp(value) {
    try {
      seterror(null);

      const { data } = await axios.post(
        `http://localhost:4200/auth/signup`,
        value
      );
      if (data?.status == 401) {
        alert(data.message);
      } else {
        navigate("/login");
      }
    } catch (err) {
      seterror(err.response.data.message);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit} className="my-5 w-50 mx-auto">
      {error ? (
        <div className={cssClasses(" py-2", "text-danger", "mt-2")}>
          {error}
        </div>
      ) : (
        ""
      )}
      <div className={cssClasses("form-floating", " mb-3")}>
        <input
          type="name"
          name="name"
          className={cssClasses("form-control")}
          id="name"
          placeholder="name"
          value={formik.values.name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <label htmlFor="name">name</label>
        {formik.touched.name && formik.errors.name ? (
          <div className={cssClasses(" py-2", "text-danger", "mt-2")}>
            {formik.errors.name}
          </div>
        ) : (
          ""
        )}
      </div>
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
      <div className={cssClasses("form-floating", " mb-3")}>
        <input
          type="password"
          name="repassword"
          className={cssClasses("form-control")}
          id="repassword"
          placeholder="repassword"
          value={formik.values.repassword}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <label htmlFor="repassword">repassword</label>

        {formik.touched.repassword && formik.errors.repassword ? (
          <div className={cssClasses(" py-2", "text-danger", "mt-2")}>
            {formik.errors.repassword}
          </div>
        ) : (
          ""
        )}
      </div>

      <button className={cssClasses(" btn", "btn-primary")} type="submit">
        Register
      </button>
    </form>
  );
}
