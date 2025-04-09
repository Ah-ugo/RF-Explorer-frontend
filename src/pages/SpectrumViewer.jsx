"use client";

import { useState, useEffect } from "react";
import { Download, RefreshCw, ChevronDown } from "lucide-react";
import SpectrumChart from "../components/SpectrumChart";
import WaterfallChart from "../components/WaterfallChart";

// API base URL
const API_BASE_URL = "https://rf-explorer-api.onrender.com";

const SpectrumViewer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [timeRange, setTimeRange] = useState("latest");
  const [threshold, setThreshold] = useState([-110]);
  const [scanData, setScanData] = useState(null);
  const [activeTab, setActiveTab] = useState("line");

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/locations`);
        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }
        const data = await response.json();
        setLocations(data);

        // Set default location if available
        if (data.length > 0) {
          setLocation(data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  // Fetch scan data when location changes
  useEffect(() => {
    if (!location) return;

    const fetchScanData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/scans?location_id=${location}&limit=1`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch scan data");
        }
        const data = await response.json();
        if (data.length > 0) {
          setScanData(data[0]);
        } else {
          setScanData(null);
        }
      } catch (error) {
        console.error("Error fetching scan data:", error);
        setScanData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScanData();
  }, [location]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/scans?location_id=${location}&limit=1`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch scan data");
      }
      const data = await response.json();
      if (data.length > 0) {
        setScanData(data[0]);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate table data from scan readings
  const getTableData = () => {
    if (!scanData || !scanData.readings || !Array.isArray(scanData.readings)) {
      return [];
    }

    return scanData.readings.map((reading) => {
      const frequency = reading.Frequency || reading.frequency;
      const power = reading.Power || reading.power;
      const status = power > threshold[0] ? "Occupied" : "Vacant";
      return { frequency, power, status, timestamp: scanData.timestamp };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Spectrum Viewer</h1>
          <p className="text-gray-600">
            Visualize and analyze RF spectrum data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </button>
          <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Spectrum Analysis</h2>
          <p className="text-sm text-gray-500">
            View and analyze RF spectrum data
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="" disabled>
                    {isLoading ? "Loading locations..." : "Select location"}
                  </option>
                  {locations.map((loc) => (
                    <option key={loc._id} value={loc._id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Time Range
              </label>
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="latest">Latest Scan</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Threshold (dBm): {threshold[0]}
              </label>
              <input
                type="range"
                min="-130"
                max="-50"
                step="1"
                value={threshold[0]}
                onChange={(e) =>
                  setThreshold([Number.parseInt(e.target.value, 10)])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex space-x-1 rounded-md bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab("line")}
                className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-sm ${
                  activeTab === "line"
                    ? "bg-white shadow"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Line Chart
              </button>
              <button
                onClick={() => setActiveTab("waterfall")}
                className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-sm ${
                  activeTab === "waterfall"
                    ? "bg-white shadow"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Waterfall
              </button>
              <button
                onClick={() => setActiveTab("3d")}
                className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-sm ${
                  activeTab === "3d"
                    ? "bg-white shadow"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                3D View
              </button>
              <button
                onClick={() => setActiveTab("table")}
                className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-sm ${
                  activeTab === "table"
                    ? "bg-white shadow"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Data Table
              </button>
            </div>
          </div>

          <div className="h-[500px]">
            {activeTab === "line" && (
              <SpectrumChart apiBaseUrl={API_BASE_URL} />
            )}

            {activeTab === "waterfall" && <WaterfallChart />}

            {activeTab === "3d" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <p>3D visualization coming soon</p>
                  <p className="text-sm">This feature is under development</p>
                </div>
              </div>
            )}

            {activeTab === "table" && (
              <div className="h-full overflow-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Frequency (MHz)</th>
                      <th className="border p-2 text-left">Power (dBm)</th>
                      <th className="border p-2 text-left">Status</th>
                      <th className="border p-2 text-left">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getTableData().length > 0 ? (
                      getTableData().map((row, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="border p-2">{row.frequency}</td>
                          <td className="border p-2">{row.power.toFixed(2)}</td>
                          <td className="border p-2">
                            {row.status === "Occupied" ? (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                Occupied
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                Vacant
                              </span>
                            )}
                          </td>
                          <td className="border p-2">
                            {new Date(row.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="border p-4 text-center text-gray-500"
                        >
                          No data available for this location
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpectrumViewer;
