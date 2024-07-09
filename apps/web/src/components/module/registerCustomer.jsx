import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import registCustomer from "../../utils/registCustomer";
import { useDispatch } from "react-redux";
import { toastify } from "../base/toastify";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../configs/redux/action/authRegist";
import axios from "axios";
import "./Register.css";
import API from "../../configs/api";

const RegisterCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validationSchema = registCustomer;
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      phone_number: "",
      password: "",
      showPassword: false,
      name: "",
      gender: "",
      role: "customer",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      dispatch(registerStart());
      try {
        const response = await API.post("/auth/register", values, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = response.data;
        localStorage.setItem("token", data.token);

        dispatch(registerSuccess(data.user));
        toastify("success", data.message || "Registration successful");
        navigate("/login");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        dispatch(registerFailure(errorMessage));
        toastify("error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full flex flex-col gap-1">
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col">
            <input
              className="border border-gray-500 rounded py-2 px-2"
              type="text"
              name="name"
              placeholder="Insert nama"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-[12px] font-poppins">
                {formik.errors.name}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <input
              className="border border-gray-500 rounded py-2 px-2"
              type="email"
              name="email"
              placeholder="Insert email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-[12px] font-poppins">
                {formik.errors.email}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <input
              className="border border-gray-500 rounded py-2 px-2"
              type="text"
              name="phone_number"
              placeholder="Insert telepon"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone_number && formik.errors.phone_number && (
              <div className="text-red-500 text-[12px] font-poppins">
                {formik.errors.phone_number}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="relative">
              <input
                className="border border-gray-500 rounded py-2 px-2 w-full"
                type={formik.values.showPassword ? "text" : "password"}
                name="password"
                placeholder="Insert password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-sm"
                onClick={() =>
                  formik.setFieldValue(
                    "showPassword",
                    !formik.values.showPassword
                  )
                }
              >
                {formik.values.showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-[12px] font-poppins">
                {formik.errors.password}
              </div>
            )}
          </div>
          {/* <h1>Gender:</h1> */}
          {/* <div className="flex space-x-4 items-center">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formik.values.gender === "male"}
                onChange={() => formik.setFieldValue("gender", "male")}
                className="mr-2 custom-radio"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formik.values.gender === "female"}
                onChange={() => formik.setFieldValue("gender", "female")}
                className="mr-2 custom-radio"
              />
              Female
            </label>
          </div> 
          {formik.touched.gender && formik.errors.gender && (
            <div className="text-red-500 text-[12px] font-poppins">
              {formik.errors.gender}
            </div>
          )}
          */}
        </div>
        <div className="flex justify-center py-2">
          <Button
            type="submit"
            className={`bg-red-500 justify-center w-full h-12 py-2 text-white text-lg font-semibold border rounded-full cursor-pointer hover:bg-[#DB3022]`}
            disabled={formik.isSubmitting || loading}
          >
            {loading ? "Loading..." : "Register"}
          </Button>
        </div>
      </form>
      <div className="flex justify-center">
        <p>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-red-maroon hover:font-semibold hover:text-red-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterCustomer;
