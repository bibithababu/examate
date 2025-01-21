import React from 'react';

const TableLoader = () => {
  // You can customize or fetch data as needed

  return (
<table className="table">
  <thead>
    <tr>
    </tr>
  </thead>
  <tbody>
      <tr className="tr">
        <td className="td"><div className="loader"></div></td>
        <td className="td"><div className="loader"></div></td>
        <td className="td"><div className="loader"></div></td>
      </tr>
  </tbody>
</table>
  );
};
export default TableLoader;