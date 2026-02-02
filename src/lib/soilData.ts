// States with available soil data (30 out of 36)
export const STATES_WITH_SOIL_DATA = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Jammu and Kashmir",
  "Delhi"
];

export const hasSoilData = (stateName: string): boolean => {
  return STATES_WITH_SOIL_DATA.includes(stateName);
};

export interface SoilDataMetrics {
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  soilMoisture: number;
}

export const getSoilEnrichmentFactor = (stateName: string, soilMetrics?: SoilDataMetrics): number => {
  if (!hasSoilData(stateName) || !soilMetrics) {
    return 1.0; // No enrichment factor if no soil data
  }
  
  // Calculate enrichment based on soil quality metrics
  const phFactor = soilMetrics.pH >= 6.0 && soilMetrics.pH <= 7.5 ? 1.1 : 0.95;
  const nutrientFactor = (soilMetrics.nitrogen + soilMetrics.phosphorus + soilMetrics.potassium) / 300;
  const organicFactor = soilMetrics.organicCarbon > 0.5 ? 1.05 : 1.0;
  const moistureFactor = soilMetrics.soilMoisture > 20 ? 1.05 : 0.98;
  
  return phFactor * nutrientFactor * organicFactor * moistureFactor;
};
