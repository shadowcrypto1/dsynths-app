import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import ReactPaginate from 'react-paginate'

const Wrapper = styled.div`
  margin: 10px auto;
  font-size: 10px;

  .pagination {
    display: flex;
    justify-content: center;
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;

    & > li {
      float: left;
    }

    & > li a {
      display: block;
      text-align: center;
      padding: 16px;
      text-decoration: none;

      :hover {
        cursor: pointer;
      }
    }

  }
  .break {
    pointer-events: none;
  }
  .active {
    & > * {
      font-weight: bold;
      font-size: 14px;
      line-height: 10px;
    }
  }
`

export const Pagination = ({ pageCount, onPageChange }) => {
  return (
    <Wrapper>
      <ReactPaginate
        previousLabel={'←'}
        nextLabel={'→'}
        breakLabel={'..'}
        breakClassName={'break'}
        pageCount={pageCount}
        marginPagesDisplayed={2} // how much to show at the beginning and end (using 2) => Previous 1, 2, .. , 9, 10 Next
        pageRangeDisplayed={0} // how much to show left and right from the current page (using 2) => Previous 1, 2 .. 9 10 (11) 12 13 ... 23 24 Next
        onPageChange={onPageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </Wrapper>
  )
}