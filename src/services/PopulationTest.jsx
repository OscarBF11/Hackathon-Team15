import React, { useEffect, useState } from 'react';
import get_population from './population';

const PopulationTest = () => {
    const [data, setData] = useState(null);
    const bound = [
        {
        "latitude": 41.351099,
        "longitude": 2.129661
        },
        {
        "latitude": 41.353928,
        "longitude": 2.136373
        },
        {
        "latitude": 41.354663,
        "longitude": 2.135839
        },
        {
        "latitude": 41.351921,
        "longitude": 2.128704
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            const res = await get_population(
                bound,
                '2025-03-04T11:00:00.000Z',
                '2025-03-04T11:39:59.000Z',
                7
        );
            console.log("Res",res);
            console.log("Res array",res.timedPopulationDensityData);
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

export default PopulationTest;