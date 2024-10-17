import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../Context";

const api = "http://localhost:5000";

function App() {
  const [login, setLogin] = useState(false);
  const [properties, setproperties] = useState({ show: false, remember: true });
  const [isError, setError] = useState({ isErr: false, errMsg: "" });
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { setSocketId, getData } = useAppContext();

  const changeError = (text) => {
    setError({ isErr: true, errMsg: text });
    setTimeout(() => {
      setError(false);
    }, 1500);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const Register = async () => {
    try {
      const response = await axios.post(`${api}/api/v1/register`, {
        username: form.username,
        password: form.password,
      });
      setForm({ username: "", password: "" });
      localStorage.setItem("token", response.data.token);
      setSocketId(response.data.username);
      navigate("/");
    } catch (error) {
      setForm({ username: "", password: "" });
      changeError(error.response.data.msg);
      console.log(error);
    }
  };

  const Login = async () => {
    console.log("run");
    try {
      const response = await axios.post(`${api}/api/v1/login`, {
        username: form.username,
        password: form.password,
      });
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      console.log(response.data.username);
      setSocketId(response.data.username);
      navigate("/");
    } catch (error) {
      console.log(error);
      setForm({ username: "", password: "" });
      changeError(error.response.data.msg);
    }
  };

  return (
    <>
      <div className="row mt-2 mt-sm-5">
        <div className="col-12 text-center fs-2">
          Welcome to our WordGame please login or register to continue
        </div>
      </div>
      <div className="row mt-5 justify-content-center ">
        <div className="col-8 col-md-6 col-lg-5 auth-box rounded">
          <div className="row">
            {login ? (
              <div className="col-12 text-center mt-2">
                Don't have an Account?{" "}
                <span
                  onClick={() => {
                    setLogin(!login);
                  }}
                  style={{ color: "blue" }}
                >
                  Register now
                </span>
                !
              </div>
            ) : (
              <div className="col-12 text-center mt-2">
                Already have an Account?{" "}
                <span
                  onClick={() => {
                    setLogin(!login);
                  }}
                  style={{ color: "blue" }}
                >
                  Login now
                </span>
                !
              </div>
            )}
          </div>
          {/*  */}
          <div className="row mt-3">
            <div className="col-12 text-center">
              Username :{" "}
              <input
                type="text"
                className="info-input rounded"
                value={form.username}
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="row mt-3 mb-3">
            <div className="col-12 text-center">
              Password :{" "}
              <input
                type={properties.show ? "text" : "password"}
                className="info-input rounded"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                }}
              />
            </div>
          </div>
          {/*  */}
          {isError.isErr && (
            <div className="col-12 text-center text-danger">
              {isError.errMsg}
            </div>
          )}

          {/*  */}
          <div className="row ">
            <div className="col-6 text-center">
              Show password{" "}
              <input
                type="checkbox"
                className="mx-2"
                checked={properties.show}
                onChange={() =>
                  setproperties({
                    ...properties,
                    show: !properties.show,
                  })
                }
              />
            </div>
          </div>
          {/*  */}
          <div className="col-12 text-end ">
            {login ? (
              <button
                className="btn btn-info m-3"
                onClick={() => {
                  Login();
                }}
              >
                Login
              </button>
            ) : (
              <button
                className="btn btn-info m-3"
                onClick={() => {
                  Register();
                }}
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
