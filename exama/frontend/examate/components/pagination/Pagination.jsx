import React from 'react';
import classnames from 'classnames';
import { usePagination,DOTS } from '@/hooks/usePagination';
import './pagination.css';
const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  const onNext = () => {  
    onPageChange(currentPage+1);
  };

  const onPrevious = () => {
    onPageChange(currentPage-1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
 
  return (
    
    <ul className="pagination">

    {/* Left navigation arrow */}
    <li
      className={classnames('pagination-item', {
        'page-item': true, 
        'disabled': currentPage === 1
      })}
      onClick={currentPage!==1 ? onPrevious : undefined}
    >
      <button className={classnames('page-link ',{'disabled ':currentPage===1})}>Prev</button>
    </li>
  
    {/* Pagination range */}
    {paginationRange.map((pageNumber) => {
      if (pageNumber === DOTS) {
        return <li key={pageNumber} className="page-link">&#8230;</li>;
      }
      return (
        <li
        key={pageNumber}
          className={classnames('pagination-item', {
            'page-item': true, 
            'active': pageNumber === currentPage
          })}
          onClick={() => onPageChange(pageNumber)}
        >
          <button className="page-link">{pageNumber}</button>
        </li>
      );
    })}
  
    {/* Right navigation arrow */}
    <li className={classnames('pagination-item', {
  'page-item': true, 
})}
onClick={currentPage !== lastPage ? onNext : undefined}
>
  <button 
    className={classnames('page-link', {
      'disabled': currentPage === lastPage
    })}
    disabled={currentPage === lastPage}
  >
    Next
  </button>
</li>
  
  </ul>
  
  );
};

export default Pagination;
