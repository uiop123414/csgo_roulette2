import Pagination from "react-bootstrap/Pagination";

const Paginator = ({ totalPages, currentPage, setCurrentPage }) => {
  if (currentPage + 4 < totalPages) {
    const getPageNumbers = () => {
      const pageNumbers = [];

      for (let i = currentPage; i <= currentPage + 4; i++) {
        pageNumbers.push(
          <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
            {i}
          </Pagination.Item>,
        );
      }
      return pageNumbers;
    };

    return (
      <Pagination>
        <Pagination.First onClick={() => setCurrentPage(1)} acitve={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
        {getPageNumbers()}
        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    );
  } else {
    const getProfile = () => {
      const pageNumbers = [];

      for (let i = 0; i < 5; i++) {
        if (totalPages - i <= 0) continue;
        pageNumbers.push(
          <Pagination.Item
            key={totalPages - i}
            active={totalPages - i === currentPage}
            onClick={() => setCurrentPage(totalPages - i)}
          >
            {totalPages - i}
          </Pagination.Item>,
        );
      }
      return pageNumbers.reverse();
    };
    return (
      <Pagination>
        <Pagination.First onClick={() => setCurrentPage(1)} acitve={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
        {getProfile()}
        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    );
  }
};

export default Paginator;
