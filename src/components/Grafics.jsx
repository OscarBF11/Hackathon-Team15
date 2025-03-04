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

const Grafics = ({labelsArray,datasetsArrayObj}) => {
    const data = {
        // labels: ["Enero", "Febrero", "Marzo", "Abril"],
        // datasets: [
        // {
        //     label: "Ventas",
        //     data: [10, 20, 30, 40],
        //     borderColor: "rgb(75, 192, 192)",
        //     backgroundColor: "rgba(75, 192, 192, 0.2)",
        // },
        // ],
        labels: labelsArray,
        datasets: datasetsArrayObj
    };


    return(<Line data={data} options={options} />);
}

export default Grafics;
