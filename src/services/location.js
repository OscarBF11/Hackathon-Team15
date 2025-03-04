// url-api:https://dashboard.networkascode.nokia.io/network-as-code-network-as-code-default/api/location-retrieval/playground/apiendpoint_5b889198-39c6-4df7-aabf-df45bf15d8b1
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const header = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'location-retrieval.nokia.rapidapi.com',
    'Content-Type': 'application/json'
}
// 649377974
const get_location = async (phoneNumber="+36721601234567") => {
    const options = {
        method: 'POST',
        url: 'https://location-retrieval.p-eu.rapidapi.com/retrieve',
        headers: header,
        data: {
            device: {
            phoneNumber: phoneNumber,
            // phoneNumber: '+36721601234567',
            // ipv4Address: {
            //     publicAddress: '192.168.1.100',
            //     privateAddress: '10.0.0.100',
            //     publicPort: 8080
            // },
            // ipv6Address: '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
            },
            maxAge: 3600
        }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        console.error(error.response.data);
    }
};


export { get_location };
