import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Search } from "lucide-react";

const mockData = [
  { state: "Uttar Pradesh", crop: "Rice", area: 5890, production: 15210, yield: 2581, season: "Kharif" },
  { state: "Punjab", crop: "Wheat", area: 3510, production: 17739, yield: 5053, season: "Rabi" },
  { state: "Haryana", crop: "Wheat", area: 2563, production: 11468, yield: 4475, season: "Rabi" },
  { state: "West Bengal", crop: "Rice", area: 5470, production: 14930, yield: 2730, season: "Kharif" },
  { state: "Madhya Pradesh", crop: "Soybean", area: 5640, production: 7123, yield: 1263, season: "Kharif" },
  { state: "Maharashtra", crop: "Cotton", area: 4180, production: 8070, yield: 1931, season: "Kharif" },
  { state: "Karnataka", crop: "Ragi", area: 1020, production: 2890, yield: 2833, season: "Kharif" },
  { state: "Tamil Nadu", crop: "Rice", area: 1980, production: 7920, yield: 4000, season: "Kharif" },
  { state: "Gujarat", crop: "Cotton", area: 2630, production: 8350, yield: 3175, season: "Kharif" },
  { state: "Rajasthan", crop: "Bajra", area: 4780, production: 4540, yield: 950, season: "Kharif" },
];

const DataExplorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");

  const filteredData = mockData.filter((item) => {
    const matchesSearch = item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === "all" || item.state === selectedState;
    const matchesSeason = selectedSeason === "all" || item.season === selectedSeason;
    return matchesSearch && matchesState && matchesSeason;
  });

  const states = ["all", ...Array.from(new Set(mockData.map(d => d.state)))];
  const seasons = ["all", "Kharif", "Rabi", "Summer", "Whole Year"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Data Explorer</h1>
          <p className="text-lg text-muted-foreground">
            Explore comprehensive agricultural data across states, crops, and seasons
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agricultural Dataset</CardTitle>
            <CardDescription>Filter and search through crop production data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by crop or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state === "all" ? "All States" : state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select Season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem key={season} value={season}>
                      {season === "all" ? "All Seasons" : season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead className="text-right">Area (000 ha)</TableHead>
                    <TableHead className="text-right">Production (000 tonnes)</TableHead>
                    <TableHead className="text-right">Yield (kg/ha)</TableHead>
                    <TableHead>Season</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.state}</TableCell>
                        <TableCell>{item.crop}</TableCell>
                        <TableCell className="text-right">{item.area.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.production.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.yield.toLocaleString()}</TableCell>
                        <TableCell>{item.season}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No data found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DataExplorer;
