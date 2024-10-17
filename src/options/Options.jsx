import React from "react";
import { useNavigate } from "react-router-dom";
const options = [
  { name: "Change username", link: "/change-username" },
  { name: "Change password", link: "/change-password" },
  { name: "Go back", link: "/" },
];

const Options = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="row">
        <div className="col-12 fs-1 text-center mt-2">WordGame options</div>
        <div className="row justify-content-center">
          <div className="col-8 col-sm-5 col-md-4">
            {options.map((item) => {
              return (
                <div
                  className="col-12 mt-3 text-white p-2 text-center bg-info rounded"
                  onClick={() => navigate(item.link)}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Options;
