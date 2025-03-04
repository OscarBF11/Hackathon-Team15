import axios from 'axios';
const API_KEY = import.meta.env.VITE_API_KEY;
const header = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'location-verification.nokia.rapidapi.com',
    'Content-Type': 'application/json'
}

const verifyLocation = async (
    phoneNumber,
    latitude,
    longitude,
    radius=100, // meters
    maxAge=60 // seconds
) => {
    const options = {
        method: 'POST',
        url: 'https://location-verification.p-eu.rapidapi.com/verify',
        headers: header,
        data: {
        device: { phoneNumber: phoneNumber },
        area: {
            areaType: 'CIRCLE',
            center: {
            latitude: latitude,
            longitude: longitude
            },
            radius: radius
        },
        maxAge: maxAge
        }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error in request:", error);
        console.error(error.response.data);
        throw error;
    }
};


const getCurrentLocation = async () => {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        return position.coords;
    } catch (error) {
        console.error("Error in request:", error);
        console.log("Activa la geolocalización en tu navegador");
        throw error;
    }
};

export {verifyLocation, getCurrentLocation};