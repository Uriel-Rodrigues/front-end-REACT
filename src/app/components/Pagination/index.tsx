interface PaginationProps {
    currentPage: number,
    lastPage: number,
    onPageChange: (page:number) => void
}

const Pagination = ({currentPage, lastPage, onPageChange}: PaginationProps) => {
    return (
        <div>
            <span>Pagina {currentPage} de {lastPage}</span> {` `}
            <button onClick={() => onPageChange(currentPage - 1)} disabled= {currentPage ===1}>Anterior</button> {` `}
            
            <button disabled>{currentPage}</button> {` `}
            
            <button onClick={() => onPageChange(currentPage + 1)} disabled= {currentPage === lastPage}> Proxima</button>
        </div>
    )
}

export default Pagination
