const BASE_URL = process.env.REACT_APP_API_URL + '/api';

if (!process.env.REACT_APP_API_URL) {
  throw new Error('REACT_APP_API_URL not defined in environment');
}

export default BASE_URL;