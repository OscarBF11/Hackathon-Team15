import React, { useEffect, useState } from 'react';
import { get_location } from './location';

const LocationTest = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const res = await get_location("+3670649377");
            console.log("Res",res);
            // console.log("Res array",res.timedPopulationDensityData);
            setData(res);
        };
        fetchData();
    }, []);

    return (
        <div>{data ? (<pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (<p>Loading...</p>)}
        </div>
    );
};

export default LocationTest;