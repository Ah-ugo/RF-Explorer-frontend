"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const SpectrumChart = ({ data, threshold = -110 }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || !Array.isArray(data)) {
      console.error("Missing chart reference or invalid data:", data);
      return;
    }

    // Format the data for the chart
    console.log("Processing readings data", data.length, "points");
    const frequencies = data.map((r) => r.Frequency || r.frequency);
    const powerLevels = data.map((r) => r.Power || r.power);

    // Create threshold line data
    const thresholdData = Array(frequencies.length).fill(threshold);

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      console.log("Destroying previous chart instance");
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // Create new chart
    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) {
      console.error("Canvas context not available");
      return;
    }

    try {
      console.log("Initializing new Chart.js instance");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: frequencies,
          datasets: [
            {
              label: "Power Level (dBm)",
              data: powerLevels,
              borderColor: "rgb(16, 185, 129)",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderWidth: 2,
              pointRadius: 0,
              fill: true,
              tension: 0.4,
            },
            {
              label: `Threshold (${threshold} dBm)`,
              data: thresholdData,
              borderColor: "rgba(239, 68, 68, 0.7)",
              borderWidth: 1,
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Frequency (MHz)",
              },
              ticks: {
                maxTicksLimit: 10,
              },
            },
            y: {
              title: {
                display: true,
                text: "Power (dBm)",
              },
              min: -120,
              max: -20,
            },
          },
        },
      });
      console.log("Chart created successfully");
    } catch (err) {
      console.error("Error creating chart:", err);
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        console.log("Destroying chart instance on unmount");
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, threshold]);

  return (
    <div className="h-full w-full">
      <canvas ref={chartRef} />
    </div>
  );
};

export default SpectrumChart;
