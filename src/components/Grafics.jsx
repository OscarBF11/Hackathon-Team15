import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const options = {
    responsive: true,
    plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Ventas Mensuales" },
    },
};

const Grafics = ({labelsArray,datasetsArray}) => {
    const data = {
        // labels: ["Enero", "Febrero", "Marzo", "Abril"],
        datasets: [
        {
            label: "Ventas",
            data: datasetsArray,
            borderColor: "rgb(158, 141, 54)",
            backgroundColor: "rgba(255, 255, 255, 0.74)",
        },
        ],
        labels: labelsArray,
        // datasets: datasetsArrayObj
    };


    return(<Line data={data} options={options} />);
}

export default Grafics;
