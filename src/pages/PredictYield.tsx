import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { TrendingUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { hasSoilData } from "@/lib/soilData";
import { supabase } from "@/integrations/supabase/client";

const PredictYield = () => {
  const [state, setState] = useState("");
  const [crop, setCrop] = useState("");
  const [season, setSeason] = useState("");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [showSoilInputs, setShowSoilInputs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [states, setStates] = useState<string[]>([]);
  const [crops, setCrops] = useState<string[]>([]);
  const [environmentalData, setEnvironmentalData] = useState({
    area: 0,
    rainfall: 0,
    temperature: 0,
    humidity: 0
  });
  const [modelInfo, setModelInfo] = useState({
    confidence: 0,
    modelUsed: "",
    dataPoints: 0
  });

  const seasons = ["Kharif", "Rabi", "Zaid", "Whole Year"];

  useEffect(() => {
    const loadAvailableData = async () => {
      try {
        const response = await fetch('/data/india-crop-data.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n').slice(1); // Skip header
        
        const stateSet = new Set<string>();
        const cropSet = new Set<string>();
        
        lines.forEach(line => {
          const parts = line.split(',');
          if (parts.length >= 3) {
            const stateName = parts[0]?.trim();
            const cropName = parts[2]?.trim();
            if (stateName) stateSet.add(stateName);
            if (cropName) cropSet.add(cropName);
          }
        });
        
        setStates(Array.from(stateSet).sort());
        setCrops(Array.from(cropSet).sort());
      } catch (error) {
        console.error('Error loading CSV data:', error);
        toast.error('Failed to load available states and crops');
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadAvailableData();
  }, []);

  const handleStateChange = (value: string) => {
    setState(value);
    setShowSoilInputs(hasSoilData(value));
  };

  const handlePredict = async () => {
    if (!state || !crop || !season) {
      toast.error("Please select state, crop, and season");
      return;
    }

    setIsLoading(true);
    setPrediction(null);

    try {
      const { data, error } = await supabase.functions.invoke('predict-yield', {
        body: { state, crop, season }
      });

      if (error) {
        console.error('Prediction error:', error);
        toast.error(error.message || "Failed to generate prediction");
        return;
      }

      if (!data.success) {
        toast.error(data.error || "Prediction failed");
        return;
      }

      const pred = data.prediction;
      
      setEnvironmentalData({
        area: Math.round(pred.area),
        rainfall: Math.round(pred.rainfall),
        temperature: Math.round(pred.temperature * 10) / 10,
        humidity: Math.round(pred.humidity)
      });

      setModelInfo({
        confidence: pred.confidence,
        modelUsed: pred.modelUsed,
        dataPoints: data.historicalDataPoints
      });

      setPrediction(Math.round(pred.yieldPerHectare));
      
      toast.success(`Prediction generated with ${Math.round(pred.confidence * 100)}% confidence!`);
    } catch (err) {
      console.error('Prediction error:', err);
      toast.error("Failed to connect to prediction service");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Predict Crop Yield</h1>
          <p className="text-lg text-muted-foreground">
            Use AI-powered models to predict crop yields based on climate and soil conditions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle>Input Parameters</CardTitle>
                <CardDescription>Enter crop and environmental data for yield prediction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingData ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
                    <p className="text-muted-foreground">Loading available states and crops...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Select value={state} onValueChange={handleStateChange}>
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {states.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="crop">Crop *</Label>
                        <Select value={crop} onValueChange={setCrop}>
                          <SelectTrigger id="crop">
                            <SelectValue placeholder="Select crop" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {crops.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="season">Season *</Label>
                        <Select value={season} onValueChange={setSeason}>
                          <SelectTrigger id="season">
                            <SelectValue placeholder="Select season" />
                          </SelectTrigger>
                          <SelectContent>
                            {seasons.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {showSoilInputs && (
                      <div className="pt-4 border-t">
                        <h3 className="text-sm font-semibold mb-4 text-success">
                          ✓ Soil data available for enhanced prediction
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Predictions for this state include soil quality enrichment factors for improved accuracy.
                        </p>
                      </div>
                    )}

                    <Button onClick={handlePredict} className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing with ML models...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Calculate Yield Prediction
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Prediction Result</CardTitle>
                <CardDescription>Estimated crop yield output</CardDescription>
              </CardHeader>
              <CardContent>
                {prediction !== null ? (
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Predicted Yield</p>
                      <p className="text-3xl sm:text-4xl font-bold text-primary">{prediction.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-2">kg/hectare</p>
                    </div>
                    
                    <div className="p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-primary">ML Model Analysis</p>
                        <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                          {Math.round(modelInfo.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {modelInfo.modelUsed} • {modelInfo.dataPoints} historical records analyzed
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Using: Linear Regression, Polynomial Regression, K-NN, Random Forest, Gradient Boosting
                      </p>
                    </div>

                    {showSoilInputs && (
                      <div className="p-3 sm:p-4 bg-success/10 rounded-lg border border-success/20">
                        <p className="text-sm text-success font-medium">
                          ✓ Enhanced with soil data
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Soil quality enrichment applied for improved accuracy
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium text-right">{state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Crop:</span>
                        <span className="font-medium">{crop}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Season:</span>
                        <span className="font-medium">{season}</span>
                      </div>
                      
                      <div className="pt-3 border-t space-y-2">
                        <p className="text-xs text-muted-foreground mb-2">Environmental Factors:</p>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Area:</span>
                          <span className="font-medium">{environmentalData.area} ha</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rainfall:</span>
                          <span className="font-medium">{environmentalData.rainfall} mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Temperature:</span>
                          <span className="font-medium">{environmentalData.temperature} °C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Humidity:</span>
                          <span className="font-medium">{environmentalData.humidity}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-3 border-t">
                        <span className="text-muted-foreground">Total Production:</span>
                        <span className="font-bold text-primary">
                          {(prediction * environmentalData.area).toLocaleString()} kg
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Enter parameters and click predict to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PredictYield;
