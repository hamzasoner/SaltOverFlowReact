import React from "react";

function Pagination({ postsPerPage, totalPosts, paginate }) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav className="pagination--container">
      {pageNumbers.map((number) => (
        <a className="pagination-link"key={number} onClick={() => paginate(number)}>
          <p>{number}</p>
        </a>
      ))}
    </nav>
  );
}
export default Pagination;