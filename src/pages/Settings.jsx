"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Save } from "lucide-react";

const Settings = () => {
  const [threshold, setThreshold] = useState([-110]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">
          Configure system settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="device">Device</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1.5">
                <Label htmlFor="system-name">System Name</Label>
                <Input id="system-name" defaultValue="RF Explorer System" />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="data-retention">Data Retention Period</Label>
                <Select defaultValue="90">
                  <SelectTrigger id="data-retention">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-backup">Automatic Backups</Label>
                  <p className="text-sm text-gray-500">
                    Automatically backup data weekly
                  </p>
                </div>
                <Switch id="auto-backup" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-gray-500">
                    Use dark theme for the interface
                  </p>
                </div>
                <Switch id="dark-mode" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Settings</CardTitle>
              <CardDescription>
                Configure spectrum analysis parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="threshold">
                    Power Threshold (dBm): {threshold[0]}
                  </Label>
                  <span className="text-sm font-medium">
                    {threshold[0]} dBm
                  </span>
                </div>
                <Slider
                  id="threshold"
                  value={threshold}
                  min={-130}
                  max={-50}
                  step={1}
                  onValueChange={setThreshold}
                />
                <p className="text-sm text-gray-500">
                  Signals below this threshold are considered vacant
                </p>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="frequency-range">Frequency Range</Label>
                <Select defaultValue="uhf">
                  <SelectTrigger id="frequency-range">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vhf">VHF (30-300 MHz)</SelectItem>
                    <SelectItem value="uhf">UHF (470-790 MHz)</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-analysis">Automatic Analysis</Label>
                  <p className="text-sm text-gray-500">
                    Automatically analyze new data
                  </p>
                </div>
                <Switch id="auto-analysis" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="prediction">Predictive Analysis</Label>
                  <p className="text-sm text-gray-500">
                    Use historical data to predict spectrum usage
                  </p>
                </div>
                <Switch id="prediction" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Location Management</CardTitle>
              <CardDescription>Manage monitoring locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md divide-y">
                  {[
                    {
                      name: "Site A (Nnobi)",
                      lat: "6.075826",
                      lng: "6.938004",
                      active: true,
                    },
                    {
                      name: "Site B (Awka)",
                      lat: "6.210433",
                      lng: "7.067951",
                      active: true,
                    },
                    {
                      name: "Site C (Onitsha)",
                      lat: "6.145986",
                      lng: "6.785104",
                      active: false,
                    },
                  ].map((location, index) => (
                    <div
                      key={index}
                      className="p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-gray-500">
                          Lat: {location.lat}, Lng: {location.lng}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            location.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {location.active ? "Active" : "Inactive"}
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  Add New Location
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="device">
          <Card>
            <CardHeader>
              <CardTitle>Device Settings</CardTitle>
              <CardDescription>
                Configure RF Explorer device settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1.5">
                <Label htmlFor="device-model">Device Model</Label>
                <Select defaultValue="3g">
                  <SelectTrigger id="device-model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3g">RF Explorer 3G Combo</SelectItem>
                    <SelectItem value="6g">RF Explorer 6G Combo</SelectItem>
                    <SelectItem value="wsub1g">
                      RF Explorer Sub 1 GHz
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="scan-interval">Scan Interval</Label>
                <Select defaultValue="15">
                  <SelectTrigger id="scan-interval">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-connect">Auto-Connect</Label>
                  <p className="text-sm text-gray-500">
                    Automatically connect to device when detected
                  </p>
                </div>
                <Switch id="auto-connect" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="continuous-scan">Continuous Scanning</Label>
                  <p className="text-sm text-gray-500">
                    Continuously scan and upload data
                  </p>
                </div>
                <Switch id="continuous-scan" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Configure API access for external applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="api-enabled">Enable API</Label>
                  <p className="text-sm text-gray-500">
                    Allow external applications to access data
                  </p>
                </div>
                <Switch id="api-enabled" defaultChecked />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type="password"
                    value="sk_test_12345678901234567890"
                    readOnly
                  />
                  <Button variant="outline" size="sm">
                    Regenerate
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Use this key to authenticate API requests
                </p>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="rate-limit">Rate Limit</Label>
                <Select defaultValue="100">
                  <SelectTrigger id="rate-limit">
                    <SelectValue placeholder="Select limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 requests/minute</SelectItem>
                    <SelectItem value="100">100 requests/minute</SelectItem>
                    <SelectItem value="500">500 requests/minute</SelectItem>
                    <SelectItem value="1000">1000 requests/minute</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium mb-2">API Documentation</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Access the API documentation to learn how to integrate with
                  external applications.
                </p>
                <Button variant="outline" size="sm">
                  View Documentation
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
