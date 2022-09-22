import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';

export const RefreshButton = ({ refetch }) => {
    return (
        <button 
            className='btn btn-outline-light btn-sm border-0 shadow-sm d-flex align-items-center m-1 text-secondary'
            onClick={refetch}
        >
            Refresh
        <FontAwesomeIcon
            icon={faRefresh}
            style={{ marginLeft: 5 }}
        />
        </button>
    )
}