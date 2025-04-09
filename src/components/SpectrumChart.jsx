"use client";

import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const SpectrumChart = ({
  apiBaseUrl = "https://rf-explorer-api.onrender.com",
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // First get locations
        const locationsResponse = await fetch(`${apiBaseUrl}/locations`);
        if (!locationsResponse.ok) {
          throw new Error("Failed to fetch locations");
        }
        const locations = await locationsResponse.json();

        if (locations.length === 0) {
          throw new Error("No locations found");
        }

        // Get the first location's ID
        const locationId = locations[0]._id;

        // Get scans for this location
        const scansResponse = await fetch(
          `${apiBaseUrl}/scans?location_id=${locationId}&limit=1`
        );
        if (!scansResponse.ok) {
          throw new Error("Failed to fetch scans");
        }
        const scans = await scansResponse.json();

        if (scans.length === 0) {
          // No real data, use sample data
          createChart(generateSampleData());
          return;
        }

        // Use the first scan's readings
        const scan = scans[0];
        if (!scan.readings || scan.readings.length === 0) {
          throw new Error("No readings in scan");
        }

        // Format the data for the chart
        const frequencies = scan.readings.map(
          (r) => r.Frequency || r.frequency
        );
        const powerLevels = scan.readings.map((r) => r.Power || r.power);

        createChart({ frequencies, powerLevels });
      } catch (error) {
        console.error("Error fetching spectrum data:", error);
        setError(error.message);
        // Use sample data as fallback
        createChart(generateSampleData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [apiBaseUrl]);

  const generateSampleData = () => {
    // Generate sample data for the chart
    const frequencies = Array.from({ length: 100 }, (_, i) => 470 + i * 3);
    const powerLevels = Array.from(
      { length: 100 },
      () => Math.random() * -120 + 20
    );
    return { frequencies, powerLevels };
  };

  const createChart = ({ frequencies, powerLevels }) => {
    // Create threshold line data
    const thresholdData = Array(frequencies.length).fill(-110);

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

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
            label: "Threshold (-110 dBm)",
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
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p>Failed to load spectrum data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return <canvas ref={chartRef} />;
};

export default SpectrumChart;
