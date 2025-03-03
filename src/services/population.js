// api-font: https://dashboard.networkascode.nokia.io/network-as-code-network-as-code-default/api/population-density-data/playground/apiendpoint_f808560e-3842-425f-a53e-c7991ffc0a70

import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const header = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'population-density-data.nokia.rapidapi.com',
    'Content-Type': 'application/json'
}

console.log("myAPI_KEY",API_KEY);

const get_population = async (boundaryArray, startDate, endDate, precision) => {
    const options = {
    method: 'POST',
    url: 'https://population-density-data.p-eu.rapidapi.com/retrieve',
    headers: header,
    data: {
    area: {
        areaType: 'POLYGON',
        boundary: boundaryArray
    },
    // startDate: '2024-04-23T14:44:18.165Z',
    // endDate: '2024-04-23T14:44:18.165Z',
    // precision: 7
    startDate: startDate,
    endDate: endDate,
    precision: precision
    }
};
    try {
        const response = await axios.request(options);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error in request:", error);
    }
};

export default get_population;