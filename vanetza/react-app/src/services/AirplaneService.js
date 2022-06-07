import axios from 'axios'

const AIRPLANES_DUBAI_API_URL = 'http://192.168.160.87:20004/data'
const MOST_POPULAR_ORIGIN_COUNTRY_API_URL = 'http://192.168.160.87:20004/mostpopularorigincountry'
const AIRPLANES_ARRIVAL_DUBAI_API_URL = 'http://192.168.160.87:20004/arrival'
const AIRPLANES_DEPARTURE_DUBAI_API_URL = 'http://192.168.160.87:20004/departure'

class AirplaneService {

    get_dubai_airplanes() {
        return axios.get(AIRPLANES_DUBAI_API_URL);
    }

    get_most_popular_origin_country() {
        return axios.get(MOST_POPULAR_ORIGIN_COUNTRY_API_URL);
    }

    get_dubai_arrival_airplanes() {
        return axios.get(AIRPLANES_ARRIVAL_DUBAI_API_URL);
    }

    get_dubai_departure_airplanes() {
        return axios.get(AIRPLANES_DEPARTURE_DUBAI_API_URL);
    }
}

export default new AirplaneService();