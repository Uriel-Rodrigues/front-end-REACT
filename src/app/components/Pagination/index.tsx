interface PaginationProps {
    currentPage: number,
    lastPage: number,
    onPageChange: (page:number) => void
}

const Pagination = ({currentPage, lastPage, onPageChange}: PaginationProps) => {
    return (
        <div className="btn-group-login">
            <span className="link-login">Pagina {currentPage} de {lastPage}</span> {` `}
            <button onClick={() => onPageChange(currentPage - 1)} disabled= {currentPage ===1} className="link-login">Anterior</button> {` `}
            
            <button disabled className="link-login">{currentPage}</button> {` `}
            
            <button onClick={() => onPageChange(currentPage + 1)} disabled= {currentPage === lastPage} className="link-login"> Proxima</button>
        </div>
    )
}

export default Pagination
