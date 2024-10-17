import React from "react";

const SearchFliters = ({ useFilters, setUseFilters, filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  return (
    <>
      <div className="row">
        <div className="col-12">
          <button
            className={
              useFilters ? "btn  btn-danger my-1" : "btn  my-1 btn-info"
            }
            onClick={() => {
              setUseFilters(!useFilters);
            }}
          >
            {useFilters ? "Turn off filters" : "Turn on filters"}
          </button>
        </div>
        <div className="col-12 border my-1 border-black py-1">
          Min members :{" "}
          <input
            type="number"
            name="min"
            id=""
            min={1}
            max={10}
            value={filters.min}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="col-12 border border-black py-1 my-1">
          Max members :{" "}
          <input
            type="number"
            name="max"
            id="max"
            min={1}
            max={10}
            value={filters.max}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="col-12 my-1 border border-black py-1">
          Min games won :{" "}
          <input
            type="number"
            name="gw"
            id=""
            min={0}
            max={2000}
            value={filters.gw}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="col-12 my-1 border border-black py-1">
          Clan type :{" "}
          <select
            onChange={(e) => handleChange(e)}
            value={filters.type}
            name="type"
          >
            <option value="open">open to join</option>
            <option value="request">request to join</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default SearchFliters;
