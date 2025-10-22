import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { hasSoilData } from "@/lib/soilData";
import { Badge } from "@/components/ui/badge";

const DataAnalysis = () => {
  const [selectedState, setSelectedState] = useState("Uttar Pradesh");

  const states = [
    "Andhra Pradesh", "Bihar", "Gujarat", "Haryana", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu",
    "Uttar Pradesh", "West Bengal", "Telangana", "Jammu and Kashmir",
    "Goa", "Tripura", "Manipur", "Meghalaya", "Nagaland"
  ];

  const cropData = [
    { crop: "Rice", yield: 3200, production: 18500, area: 5780 },
    { crop: "Wheat", yield: 3100, production: 15200, area: 4903 },
    { crop: "Maize", yield: 2800, production: 12300, area: 4393 },
    { crop: "Cotton", yield: 1950, production: 8900, area: 4564 },
    { crop: "Sugarcane", yield: 71500, production: 71000, area: 993 },
  ];

  const trendData = [
    { year: "2019", yield: 2800, production: 12500 },
    { year: "2020", yield: 2950, production: 13200 },
    { year: "2021", yield: 3100, production: 14100 },
    { year: "2022", yield: 3200, production: 15300 },
    { year: "2023", yield: 3400, production: 16800 },
  ];

  const soilData = [
    { metric: "pH Level", value: 6.8, optimal: "6.0-7.5" },
    { metric: "Nitrogen (kg/ha)", value: 245, optimal: ">200" },
    { metric: "Phosphorus (kg/ha)", value: 28, optimal: "20-40" },
    { metric: "Potassium (kg/ha)", value: 185, optimal: "150-250" },
    { metric: "Organic Carbon (%)", value: 0.68, optimal: ">0.5" },
  ];

  const showSoil = hasSoilData(selectedState);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Data Analysis</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive agricultural analytics and insights by region
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select State</CardTitle>
            <CardDescription>Choose a state to view detailed agricultural analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showSoil ? (
                <Badge variant="default" className="bg-success">Soil Data Available</Badge>
              ) : (
                <Badge variant="secondary">Limited Data</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Crop Performance</CardTitle>
              <CardDescription>Yield comparison across major crops</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <BarChart data={cropData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="crop"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="yield" fill="hsl(var(--chart-1))" name="Yield (kg/ha)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historical Trends</CardTitle>
              <CardDescription>5-year yield and production analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="year"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="yield" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    name="Yield (kg/ha)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="production" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Production (000 tonnes)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {showSoil && (
          <Card>
            <CardHeader>
              <CardTitle>Soil Quality Metrics</CardTitle>
              <CardDescription>
                Soil health indicators for {selectedState} - enhancing prediction accuracy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {soilData.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground mb-1">{item.metric}</p>
                    <p className="text-2xl font-bold text-foreground mb-1">{item.value}</p>
                    <p className="text-xs text-success">Optimal: {item.optimal}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20">
                <p className="text-sm text-success font-medium">
                  ✓ Soil data enrichment active
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Yield predictions for this state incorporate soil quality metrics for enhanced accuracy
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!showSoil && (
          <Card className="border-muted">
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
              <CardDescription>Key insights for {selectedState}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <h3 className="font-semibold mb-2">Climate-Based Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Predictions for this state are based on climate data including rainfall patterns, 
                    temperature variations, and humidity levels. Enhanced soil metrics are not currently 
                    available for this region.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Primary Factor</p>
                    <p className="text-lg font-bold text-foreground">Rainfall</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Data Sources</p>
                    <p className="text-lg font-bold text-foreground">Climate & Remote Sensing</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Model Accuracy</p>
                    <p className="text-lg font-bold text-foreground">85%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default DataAnalysis;
