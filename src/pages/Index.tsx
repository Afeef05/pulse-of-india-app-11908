import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import TopCropsChart from "@/components/TopCropsChart";
import StatePerformanceChart from "@/components/StatePerformanceChart";
import SeasonChart from "@/components/SeasonChart";
import InfoSection from "@/components/InfoSection";
import { TrendingUp, Sprout, MapPin, Cloud } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Crop Yield Prediction Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-powered insights for Indian agricultural data using climate and remote sensing
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatsCard
            title="Total Production"
            value="18264.82M kg"
            description="Aggregate crop production"
            icon={TrendingUp}
            trend="↑ 12.5%"
          />
          <StatsCard
            title="Average Yield"
            value="3663.14 kg/ha"
            description="Mean yield across crops"
            icon={Sprout}
            trend="↑ 8.3%"
          />
          <StatsCard
            title="Total Area"
            value="5314106K ha"
            description="Cultivated area"
            icon={MapPin}
          />
          <StatsCard
            title="Districts"
            value="29"
            description="Active regions"
            icon={Cloud}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <TopCropsChart />
          <StatePerformanceChart />
        </div>

        <div className="mb-8">
          <SeasonChart />
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <InfoSection
            title="Climate Drivers"
            items={[
              "Rainfall patterns",
              "Temperature variations",
              "Humidity levels",
              "Growing Degree Days (GDD)",
            ]}
          />
          <InfoSection
            title="Input Factors"
            items={[
              "Fertilizer application",
              "Pesticide usage",
              "Cultivated area",
              "Soil quality indices",
            ]}
          />
          <InfoSection
            title="Prediction Models"
            items={[
              "Linear regression",
              "Machine learning",
              "Hybrid approaches",
              "Ensemble methods",
            ]}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
