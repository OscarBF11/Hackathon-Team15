import React, { useState } from 'react';
import {verifyLocation, getCurrentLocation} from '../verifyLocation';

const VerifyLoc = () => {
    const [phoneNumber, setPhoneNumber] = useState('+34649377974');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [radius, setRadius] = useState(100);
    const [maxAge, setMaxAge] = useState(60);
    const [result, setResult] = useState(null);

    // current location
    const handleLoc = async () => {
        const loc = await getCurrentLocation();
        console.log("Current location",loc);
    };
    const handleVerify = async () => {
        try {
            const data = await verifyLocation(phoneNumber, latitude, longitude, radius, maxAge);
            setResult(data);
        } catch (error) {
            console.error("Error in request:", error);
        }
    };

    handleLoc();

    return (
        <div>
            <h1>Verify Location</h1>
            <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
                type="text"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
            />
            <input
                type="text"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
            />
            <input
                type="number"
                placeholder="Radius (meters)"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
            />
            <input
                type="number"
                placeholder="Max Age (seconds)"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
            />
            <button onClick={handleVerify}>Verify</button>
            {result && (
                <div>
                    <h2>Result:</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default VerifyLoc;