import React from "react";
import { FaSearch } from "react-icons/fa";
import "./searchbox.css";


import PropTypes from 'prop-types';

function SearchBox(props) {
  return (
    <div className="input-group" style={{ width: "300px" }}>
      <input
        type="search"
        placeholder="What're you searching for?"
        aria-describedby="button-addon1"
        value={props.search}
        onChange={(e) => {
          props.setSearch(e.target.value);
          if (e.target.value === "") {
            props.originalUsers && props.setUsers?.(props.originalUsers);
            props.setNoUser(false)
            props.setSearchTerm("")
            props.handleFetchData()
          } else {
           
            props.handleSearchApi(e.target.value);
           
          
          }
        }}
        className="form-control border-0 bg-light"
        style={{ width: "30px" }}
      />

      <button
        data-testid="search"
        type="submit"
        className="btn text-primary"
       > <FaSearch /></button>
    </div>
  );
}

SearchBox.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  originalUsers: PropTypes.array,
  setUsers: PropTypes.func,
  handleSearchApi: PropTypes.func.isRequired,
};

export default SearchBox;

