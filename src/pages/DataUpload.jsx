"use client";

import { useState, useEffect } from "react";
import { Upload, AlertCircle, Check } from "lucide-react";

// API base URL
const API_BASE_URL = "https://rf-explorer-api.onrender.com";

const DataUpload = () => {
  const [uploadMethod, setUploadMethod] = useState("file");
  const [selectedFile, setSelectedFile] = useState(null);
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [newLocationName, setNewLocationName] = useState("");
  const [locations, setLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await fetch(`${API_BASE_URL}/locations`);
        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setErrorMessage("Failed to load locations. Please try again.");
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCreateNewLocation = async () => {
    if (!newLocationName || !latitude || !longitude) {
      setUploadStatus("error");
      setErrorMessage("Please enter location name, latitude, and longitude");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newLocationName,
          latitude: Number.parseFloat(latitude),
          longitude: Number.parseFloat(longitude),
          active: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create location");
      }

      const newLocation = await response.json();

      // Add the new location to the locations array
      setLocations([...locations, newLocation]);

      // Select the newly created location
      setLocation(newLocation._id);

      // Reset the form
      setNewLocationName("");
      setLatitude("");
      setLongitude("");

      setUploadStatus("success");
      setErrorMessage("New location created successfully!");
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(`Error creating location: ${error.message}`);
    }
  };

  const handleUpload = async () => {
    // Validate inputs
    if (uploadMethod === "file" && !selectedFile) {
      setUploadStatus("error");
      setErrorMessage("Please select a file to upload");
      return;
    }

    if (!location) {
      setUploadStatus("error");
      setErrorMessage("Please select a location");
      return;
    }

    // Simulate upload process
    setIsUploading(true);
    setUploadStatus("idle");

    try {
      // Upload file to API
      if (uploadMethod === "file" && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("location_id", location);
        formData.append("start_frequency", 470); // Example values
        formData.append("end_frequency", 790); // Example values

        const response = await fetch(`${API_BASE_URL}/scans`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to upload scan");
        }

        const result = await response.json();
        console.log("Upload successful:", result);
      } else if (uploadMethod === "manual") {
        // Handle manual entry (would need to implement this)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        // Simulate for device upload method
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setUploadStatus("success");
      setSelectedFile(null);

      // Reset form after successful upload
      if (uploadMethod === "file") {
        const fileInput = document.getElementById("file-upload");
        if (fileInput) fileInput.value = "";
      }
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(`Error during upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Data Upload</h1>
        <p className="text-gray-600">
          Upload RF Explorer readings to the database
        </p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Upload RF Explorer Data</h2>
          <p className="text-sm text-gray-500">
            Upload data from your RF Explorer device to analyze spectrum usage
          </p>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 rounded-md bg-gray-100 p-1 mb-4">
              <button
                onClick={() => setUploadMethod("file")}
                className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-sm ${
                  uploadMethod === "file"
                    ? "bg-white shadow"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                File Upload
              </button>
              <button
                onClick={() => setUploadMethod("device")}
                className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-sm ${
                  uploadMethod === "device"
                    ? "bg-white shadow"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Direct from Device
              </button>
              <button
                onClick={() => setUploadMethod("manual")}
                className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-sm ${
                  uploadMethod === "manual"
                    ? "bg-white shadow"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Manual Entry
              </button>
            </div>

            {/* File Upload Tab */}
            {uploadMethod === "file" && (
              <div className="space-y-4">
                <div className="grid w-full gap-1.5">
                  <label htmlFor="file-upload" className="text-sm font-medium">
                    Upload CSV or RFE file
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".csv,.rfe,.xlsx"
                    onChange={handleFileChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-gray-100 file:text-gray-900 file:text-sm file:font-medium"
                  />
                  <p className="text-sm text-gray-500">
                    Supported formats: CSV, RFE, XLSX (Excel)
                  </p>
                </div>

                {selectedFile && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium">Selected file:</p>
                    <p className="text-sm">
                      {selectedFile.name} (
                      {(selectedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Device Tab */}
            {uploadMethod === "device" && (
              <div className="p-8 border-2 border-dashed rounded-md text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">
                  Connect RF Explorer Device
                </h3>
                <p className="text-sm text-gray-500 mt-2 mb-4">
                  Connect your RF Explorer device via USB to upload data
                  directly
                </p>
                <button
                  disabled
                  className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-400 cursor-not-allowed"
                >
                  Connect Device
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Note: Direct device connection is coming soon
                </p>
              </div>
            )}

            {/* Manual Entry Tab */}
            {uploadMethod === "manual" && (
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <label htmlFor="start-freq" className="text-sm font-medium">
                      Start Frequency (MHz)
                    </label>
                    <input
                      id="start-freq"
                      type="number"
                      placeholder="e.g., 470"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor="end-freq" className="text-sm font-medium">
                      End Frequency (MHz)
                    </label>
                    <input
                      id="end-freq"
                      type="number"
                      placeholder="e.g., 790"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="readings" className="text-sm font-medium">
                    Frequency Readings (CSV format)
                  </label>
                  <textarea
                    id="readings"
                    className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    placeholder="Frequency,Power&#10;470,-95.2&#10;471,-97.8&#10;..."
                  />
                  <p className="text-sm text-gray-500">
                    Enter frequency and power level readings in CSV format
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="grid gap-1.5">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="" disabled>
                  {isLoadingLocations
                    ? "Loading locations..."
                    : "Select location"}
                </option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc._id}>
                    {loc.name}
                  </option>
                ))}
                <option value="new">Add New Location</option>
              </select>
            </div>

            {location === "new" && (
              <div className="space-y-4 p-4 border border-gray-200 rounded-md">
                <div className="grid gap-1.5">
                  <label
                    htmlFor="location-name"
                    className="text-sm font-medium"
                  >
                    Location Name
                  </label>
                  <input
                    id="location-name"
                    type="text"
                    placeholder="e.g., Site D (Enugu)"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <label htmlFor="latitude" className="text-sm font-medium">
                      Latitude
                    </label>
                    <input
                      id="latitude"
                      type="text"
                      placeholder="e.g., 6.075826"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor="longitude" className="text-sm font-medium">
                      Longitude
                    </label>
                    <input
                      id="longitude"
                      type="text"
                      placeholder="e.g., 6.938004"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCreateNewLocation}
                  className="w-full px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                  Create New Location
                </button>
              </div>
            )}
          </div>

          {uploadStatus === "error" && (
            <div className="mt-4 p-4 border border-red-200 rounded-md bg-red-50 text-red-800">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Error</h3>
                  <p className="text-sm">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="mt-4 p-4 border border-green-200 rounded-md bg-green-50 text-green-800">
              <div className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Success</h3>
                  <p className="text-sm">Data uploaded successfully!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleUpload}
            disabled={isUploading || location === "new"}
            className={`w-full px-4 py-2 text-sm font-medium rounded-md ${
              isUploading || location === "new"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload Data"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;
