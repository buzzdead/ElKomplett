import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Number of products sold',
    },
  },
}
const generateRandomData = () => {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 200) - 100)
}

const todaysDate = new Date();
const options2: Intl.DateTimeFormatOptions = { month: 'short' };
const monthName = todaysDate.toLocaleString('en-US', options2);

console.log(monthName); // Outputs the 3-letter abbreviation of the current month


const labels = Array.from({ length: 5 }, (_, index) => `${index * 7 + 1} ${monthName}`);

const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: generateRandomData(),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
}

type DataPoints = {dateString: string, quantity: number}

interface Props {
  myData: DataPoints[] | undefined
}

export const SalesChart = ({myData}: Props) => {
  const theData = Array.from({ length: 30 }).fill(0) as number[]
  myData?.forEach(d => {
    const date = new Date(d.dateString)
    theData[date.getDay()] += d.quantity
  })
  data.datasets[0].data = theData as number[]
  return <Line style={{height: 300,  maxWidth: 600}} options={options} data={data} />
}
