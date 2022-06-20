import axios from '../lib/axios';

const useCustomFixture = () => {
    // const csrf = axios.get('/sanctum/csrf-cookie')

    const postFixture = async (...props) => {
        // await csrf()
        axios
            .post('api/fixtures', ...props)
            .then(d => d)
            .catch(e => console.error(e.message))
    }

    return {
        postFixture,
    }
}

export default useCustomFixture;