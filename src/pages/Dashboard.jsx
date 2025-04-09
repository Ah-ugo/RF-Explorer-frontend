"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, Database, Upload, MapPin, Clock } from "lucide-react";
import SpectrumChart from "../components/SpectrumChart";

// API base URL
const API_BASE_URL = "https://rf-explorer-api.onrender.com";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalReadings: 0,
    lastUpload: "",
    activeFrequencies: 0,
    vacantFrequencies: 0,
    locations: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Fetch dashboard data from API
    const fetchData = async () => {
      try {
        // Fetch locations
        const locationsResponse = await fetch(`${API_BASE_URL}/locations`);
        const locationsData = await locationsResponse.json();

        // Fetch scans
        const scansResponse = await fetch(`${API_BASE_URL}/scans?limit=10`);
        const scansData = await scansResponse.json();

        // Get the most recent scan
        const sortedScans = scansData.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        // Create recent activity from scans
        const activity = sortedScans.slice(0, 4).map((scan) => {
          const location = locationsData.find(
            (loc) => loc._id === scan.location_id
          ) || { name: "Unknown" };
          const scanDate = new Date(scan.timestamp);
          const now = new Date();
          const diffMs = now - scanDate;

          // Format relative time
          let timeAgo;
          if (diffMs < 60000) {
            // less than 1 minute
            timeAgo = "Just now";
          } else if (diffMs < 3600000) {
            // less than 1 hour
            timeAgo = `${Math.floor(diffMs / 60000)} minutes ago`;
          } else if (diffMs < 86400000) {
            // less than 1 day
            timeAgo = `${Math.floor(diffMs / 3600000)} hours ago`;
          } else {
            timeAgo = `${Math.floor(diffMs / 86400000)} days ago`;
          }

          return {
            action: "Spectrum scan uploaded",
            location: location.name,
            time: timeAgo,
          };
        });

        // If we don't have enough real activity, add some placeholder items
        while (activity.length < 4) {
          activity.push({
            action: "System activity",
            location: "All sites",
            time: "Recently",
          });
        }

        setRecentActivity(activity);

        // Calculate stats
        let totalReadings = 0;
        let activeFreqs = 0;
        let vacantFreqs = 0;

        // For each scan, count the readings
        scansData.forEach((scan) => {
          if (scan.readings && Array.isArray(scan.readings)) {
            totalReadings += scan.readings.length;

            // Count active/vacant frequencies based on threshold
            scan.readings.forEach((reading) => {
              if (reading.Power > -110) {
                activeFreqs++;
              } else {
                vacantFreqs++;
              }
            });
          }
        });

        // Set stats
        setStats({
          totalReadings: totalReadings || 0,
          lastUpload: sortedScans.length > 0 ? sortedScans[0].timestamp : "",
          activeFrequencies: activeFreqs || 0,
          vacantFrequencies: vacantFreqs || 0,
          locations: locationsData.length || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set some default data if API fails
        setStats({
          totalReadings: 0,
          lastUpload: "",
          activeFrequencies: 0,
          vacantFrequencies: 0,
          locations: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const vacantPercentage =
    (stats.vacantFrequencies /
      (stats.activeFrequencies + stats.vacantFrequencies)) *
      100 || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Overview of your RF Explorer data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="flex flex-row items-center justify-between p-4 pb-2">
            <h3 className="text-sm font-medium">Total Readings</h3>
            <Database className="w-4 h-4 text-gray-500" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {stats.totalReadings.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Across all locations</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="flex flex-row items-center justify-between p-4 pb-2">
            <h3 className="text-sm font-medium">Last Upload</h3>
            <Upload className="w-4 h-4 text-gray-500" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {formatDate(stats.lastUpload).split(",")[0]}
            </div>
            <p className="text-xs text-gray-500">
              {formatDate(stats.lastUpload).split(",")[1]}
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="flex flex-row items-center justify-between p-4 pb-2">
            <h3 className="text-sm font-medium">Spectrum Usage</h3>
            <Activity className="w-4 h-4 text-gray-500" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {vacantPercentage.toFixed(1)}% Vacant
            </div>
            <div className="h-2 mt-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${vacantPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="flex flex-row items-center justify-between p-4 pb-2">
            <h3 className="text-sm font-medium">Locations</h3>
            <MapPin className="w-4 h-4 text-gray-500" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.locations}</div>
            <p className="text-xs text-gray-500">Monitoring sites</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spectrum Overview Card */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Spectrum Overview</h3>
            <p className="text-sm text-gray-500">
              Latest frequency scan results
            </p>
          </div>
          <div className="px-6 h-80">
            <SpectrumChart apiBaseUrl={API_BASE_URL} />
          </div>
          <div className="p-6 border-t border-gray-200">
            <Link
              to="/spectrum"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              View detailed spectrum
            </Link>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <p className="text-sm text-gray-500">Latest updates and uploads</p>
          </div>
          <div className="px-6 pb-0">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      {activity.location} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 mt-4">
            <Link
              to="/upload"
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Upload new data
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
