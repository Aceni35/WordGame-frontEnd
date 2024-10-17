import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const api = "http://localhost:5000";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [isError, setError] = useState({ isErr: false, errMsg: "" });
  const [form, setForm] = useState({ password: "", password2: "" });

  const changeError = (text) => {
    setError({ isErr: true, errMsg: text });
    setTimeout(() => {
      setError(false);
    }, 1500);
  };

  const changePassword = async () => {
    try {
      if (form.password != form.password2) {
        changeError("both usernames have to match");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${api}/api/v1/changePassword`,
        {
          password: form.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      changeError("Password changed successfuly");
      console.log(response);
    } catch (error) {
      console.log(error);
      changeError(error.response.data.msg);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12 fs-1 text-center mt-2">
          Change WordGame password
        </div>

        <div className="row justify-content-center ">
          <div className="col-12 col-md-4 auth-box ">
            <div className="row auth-box p-3 ">
              <div className="col-12">
                Enter new password :
                <input
                  type="password"
                  className="info-input mx-1"
                  value={form.password2}
                  onChange={(e) => {
                    setForm({ ...form, password2: e.target.value });
                  }}
                />
              </div>
              <div className="col-12 mt-3">
                re-Enter New password :
                <input
                  type="password"
                  className="info-input mx-1"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                  }}
                />
              </div>
            </div>
            {isError.isErr && (
              <div className="col-12 text-center text-danger">
                {isError.errMsg}
              </div>
            )}
            <div className="row pb-2">
              <div className="col-12 d-flex justify-content-around">
                <button
                  className="btn btn-danger px-3 "
                  onClick={() => {
                    navigate("/options");
                  }}
                >
                  Discard
                </button>
                <button
                  className="btn btn-success px-3"
                  onClick={() => changePassword()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
