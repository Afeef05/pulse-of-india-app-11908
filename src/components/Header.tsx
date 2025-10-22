import { Sprout, BarChart3, TrendingUp, FileText, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import ChatbotDropdown from "@/components/ChatbotDropdown";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Sprout className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AgriPredict</span>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <nav className="flex items-center gap-2">
              <Button 
                variant={isActive("/") ? "default" : "ghost"} 
                size="sm" 
                className="gap-2"
                onClick={() => navigate("/")}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Button>
              <Button 
                variant={isActive("/data-explorer") ? "default" : "ghost"} 
                size="sm" 
                className="gap-2"
                onClick={() => navigate("/data-explorer")}
              >
                <FileText className="w-4 h-4" />
                Data Explorer
              </Button>
              <Button 
                variant={isActive("/predict-yield") ? "default" : "ghost"} 
                size="sm" 
                className="gap-2"
                onClick={() => navigate("/predict-yield")}
              >
                <TrendingUp className="w-4 h-4" />
                Predict Yield
              </Button>
              <Button 
                variant={isActive("/data-analysis") ? "default" : "ghost"} 
                size="sm" 
                className="gap-2"
                onClick={() => navigate("/data-analysis")}
              >
                <FileText className="w-4 h-4" />
                Data Analysis
              </Button>
            </nav>
            <ChatbotDropdown />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ChatbotDropdown />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8">
                <Button 
                  variant={isActive("/") ? "default" : "ghost"} 
                  className="justify-start gap-2"
                  onClick={() => handleNavigate("/")}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Button>
                <Button 
                  variant={isActive("/data-explorer") ? "default" : "ghost"} 
                  className="justify-start gap-2"
                  onClick={() => handleNavigate("/data-explorer")}
                >
                  <FileText className="w-4 h-4" />
                  Data Explorer
                </Button>
                <Button 
                  variant={isActive("/predict-yield") ? "default" : "ghost"} 
                  className="justify-start gap-2"
                  onClick={() => handleNavigate("/predict-yield")}
                >
                  <TrendingUp className="w-4 h-4" />
                  Predict Yield
                </Button>
                <Button 
                  variant={isActive("/data-analysis") ? "default" : "ghost"} 
                  className="justify-start gap-2"
                  onClick={() => handleNavigate("/data-analysis")}
                >
                  <FileText className="w-4 h-4" />
                  Data Analysis
                </Button>
              </nav>
            </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
