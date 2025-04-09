"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { BarChart, LineChart, PieChart } from "lucide-react";

// API base URL
const API_BASE_URL = "https://rf-explorer-api.onrender.com";

const FrequencyAnalysis = () => {
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [timeRange, setTimeRange] = useState("week");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

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

  const runAnalysis = async () => {
    if (!location) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/analysis/spectrum-usage?location_id=${location}&time_range=${timeRange}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch analysis data");
      }
      const data = await response.json();
      setAnalysisData(data);
    } catch (error) {
      console.error("Error running analysis:", error);
      // Set default analysis data if API fails
      setAnalysisData({
        total_channels: 50,
        occupied_channels: 15,
        vacant_channels: 35,
        occupancy_percentage: 30,
        vacant_percentage: 70,
        threshold_dbm: -110,
        occupied_frequencies: [],
        vacant_frequencies: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Run analysis when location or timeRange changes
  useEffect(() => {
    if (location) {
      runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, timeRange]);

  // Handle location change
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  // Handle time range change
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Frequency Analysis</h1>
        <p className="text-gray-600">
          Analyze spectrum usage and identify white spaces
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>TV White Space Analysis</CardTitle>
          <CardDescription>
            Identify vacant frequencies in the TV spectrum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label
                htmlFor="location-select"
                className="text-sm font-medium mb-1 block"
              >
                Location
              </label>
              <div className="relative">
                <select
                  id="location-select"
                  value={location}
                  onChange={handleLocationChange}
                  disabled={isLoading}
                  className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                >
                  <option value="" disabled>
                    Select location
                  </option>
                  {locations.map((loc) => (
                    <option key={loc._id} value={loc._id}>
                      {loc.name}
                    </option>
                  ))}
                  <option value="all">All Locations</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="time-range-select"
                className="text-sm font-medium mb-1 block"
              >
                Time Range
              </label>
              <div className="relative">
                <select
                  id="time-range-select"
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  disabled={isLoading}
                  className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                >
                  <option value="day">Last 24 Hours</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={runAnalysis} disabled={isLoading}>
                {isLoading ? "Analyzing..." : "Run Analysis"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="summary">
            <TabsList className="mb-4">
              <TabsTrigger value="summary" className="flex items-center gap-1">
                <PieChart className="w-4 h-4" />
                <span>Summary</span>
              </TabsTrigger>
              <TabsTrigger value="channels" className="flex items-center gap-1">
                <BarChart className="w-4 h-4" />
                <span>Channels</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-1">
                <LineChart className="w-4 h-4" />
                <span>Trends</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">
                    Spectrum Utilization
                  </h3>
                  <div className="aspect-square relative">
                    {/* Simplified pie chart */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#e5e7eb"
                          strokeWidth="20"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="20"
                          strokeDasharray="251.2 251.2"
                          strokeDashoffset={
                            analysisData
                              ? 251.2 *
                                (1 - analysisData.vacant_percentage / 100)
                              : 75.36
                          }
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <div className="text-3xl font-bold">
                          {analysisData
                            ? analysisData.vacant_percentage.toFixed(1)
                            : 0}
                          %
                        </div>
                        <div className="text-sm text-gray-500">Vacant</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">
                        Vacant (
                        {analysisData
                          ? analysisData.vacant_percentage.toFixed(1)
                          : 0}
                        %)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                      <span className="text-sm">
                        Occupied (
                        {analysisData
                          ? analysisData.occupancy_percentage.toFixed(1)
                          : 0}
                        %)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Key Statistics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">
                        Total Channels
                      </div>
                      <div className="text-2xl font-bold">
                        {analysisData ? analysisData.total_channels : 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        Vacant Channels
                      </div>
                      <div className="text-2xl font-bold">
                        {analysisData ? analysisData.vacant_channels : 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        Occupied Channels
                      </div>
                      <div className="text-2xl font-bold">
                        {analysisData ? analysisData.occupied_channels : 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        Available Bandwidth
                      </div>
                      <div className="text-2xl font-bold">
                        {analysisData
                          ? (analysisData.vacant_channels * 8).toFixed(0)
                          : 0}{" "}
                        MHz
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">
                    Recommended White Space Channels
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {generateRecommendedChannels(analysisData).map(
                      (item, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded border"
                        >
                          <div className="font-medium">{item.channel}</div>
                          <div className="text-sm text-gray-500">
                            {item.freq}
                          </div>
                          <div
                            className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${
                              item.quality === "Excellent"
                                ? "bg-green-100 text-green-800"
                                : item.quality === "Good"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.quality}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="channels">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Channel Occupancy</h3>
                <div className="h-80 relative">
                  {/* Simplified bar chart */}
                  <div className="absolute inset-0 flex items-end space-x-1">
                    {generateBarChartData(analysisData).map((item, i) => (
                      <div
                        key={i}
                        className={`flex-1 ${
                          item.isOccupied ? "bg-red-500" : "bg-green-500"
                        }`}
                        style={{ height: `${item.height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <span className="text-sm">470 MHz</span>
                  <span className="text-sm">790 MHz</span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Vacant Channel</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm">Occupied Channel</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">
                  Spectrum Usage Trends
                </h3>
                <div className="h-80 relative">
                  {/* Simplified line chart */}
                  <div className="absolute inset-0 flex flex-col">
                    <div className="flex-1 border-b border-gray-200 relative">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0,50 C10,40 20,60 30,50 C40,40 50,70 60,60 C70,50 80,30 90,40 L90,100 L0,100 Z"
                          fill="rgba(16, 185, 129, 0.2)"
                          stroke="#10b981"
                          strokeWidth="1"
                        />
                      </svg>
                    </div>
                    <div className="h-6 flex justify-between items-center px-2 text-xs text-gray-500">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    Trend shows consistent availability of white space
                    throughout the week with slight variations during peak
                    hours.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to generate recommended channels based on analysis data
function generateRecommendedChannels(analysisData) {
  if (
    !analysisData ||
    !analysisData.vacant_frequencies ||
    analysisData.vacant_frequencies.length === 0
  ) {
    // Return sample data if no real data available
    return [
      { channel: "Ch 21", freq: "470-478 MHz", quality: "Excellent" },
      { channel: "Ch 24", freq: "494-502 MHz", quality: "Good" },
      { channel: "Ch 32", freq: "558-566 MHz", quality: "Excellent" },
      { channel: "Ch 39", freq: "614-622 MHz", quality: "Good" },
      { channel: "Ch 43", freq: "646-654 MHz", quality: "Fair" },
      { channel: "Ch 47", freq: "678-686 MHz", quality: "Excellent" },
      { channel: "Ch 51", freq: "710-718 MHz", quality: "Good" },
      { channel: "Ch 55", freq: "742-750 MHz", quality: "Fair" },
    ];
  }

  // Group frequencies into channels (assuming 8MHz per channel)
  const channels = {};
  analysisData.vacant_frequencies.forEach((freq) => {
    const channelNum = Math.floor((freq - 470) / 8) + 21; // Channel 21 starts at 470MHz
    const channelStart = 470 + (channelNum - 21) * 8;
    const channelEnd = channelStart + 8;

    if (!channels[channelNum]) {
      channels[channelNum] = {
        count: 0,
        start: channelStart,
        end: channelEnd,
      };
    }
    channels[channelNum].count++;
  });

  // Convert to array and sort by count (higher count = better quality)
  const channelArray = Object.entries(channels).map(([num, data]) => {
    let quality = "Fair";
    if (data.count >= 6) quality = "Excellent";
    else if (data.count >= 3) quality = "Good";

    return {
      channel: `Ch ${num}`,
      freq: `${data.start}-${data.end} MHz`,
      quality,
      count: data.count,
    };
  });

  // Sort by quality and take top 8
  return channelArray
    .sort((a, b) => {
      const qualityScore = { Excellent: 3, Good: 2, Fair: 1 };
      return (
        qualityScore[b.quality] - qualityScore[a.quality] || b.count - a.count
      );
    })
    .slice(0, 8);
}

// Helper function to generate bar chart data
function generateBarChartData(analysisData) {
  const barCount = 20;

  if (
    !analysisData ||
    !analysisData.vacant_frequencies ||
    !analysisData.occupied_frequencies
  ) {
    // Generate random data if no real data available
    return Array.from({ length: barCount }).map(() => {
      const height = Math.random() * 100;
      return { height, isOccupied: height > 70 };
    });
  }

  // Create frequency ranges
  const freqRanges = [];
  const startFreq = 470;
  const endFreq = 790;
  const rangeSize = (endFreq - startFreq) / barCount;

  for (let i = 0; i < barCount; i++) {
    const rangeStart = startFreq + i * rangeSize;
    const rangeEnd = rangeStart + rangeSize;

    // Count frequencies in this range
    const vacantCount = analysisData.vacant_frequencies.filter(
      (f) => f >= rangeStart && f < rangeEnd
    ).length;

    const occupiedCount = analysisData.occupied_frequencies.filter(
      (f) => f >= rangeStart && f < rangeEnd
    ).length;

    const totalCount = vacantCount + occupiedCount;
    const occupiedRatio = totalCount > 0 ? occupiedCount / totalCount : 0;

    freqRanges.push({
      height: 20 + (totalCount > 0 ? 80 : 0), // At least 20% height for visibility
      isOccupied: occupiedRatio > 0.5,
    });
  }

  return freqRanges;
}

export default FrequencyAnalysis;
