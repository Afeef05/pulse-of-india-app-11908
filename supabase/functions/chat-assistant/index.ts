import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Load crop data for context
    let cropDataContext = '';
    try {
      const datasetUrl = "https://edfa9b11-f8db-438b-9224-eee4ef7be4a4.lovableproject.com/data/india-crop-data.csv";
      const dataResponse = await fetch(datasetUrl);
      const csvText = await dataResponse.text();
      const lines = csvText.split('\n');
      
      // Get unique states and crops
      const states = new Set<string>();
      const crops = new Set<string>();
      lines.slice(1, 100).forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 3) {
          states.add(parts[0]?.trim());
          crops.add(parts[2]?.trim());
        }
      });
      
      cropDataContext = `\n\nAvailable States: ${Array.from(states).filter(Boolean).join(', ')}
Available Crops: ${Array.from(crops).filter(Boolean).join(', ')}`;
    } catch (error) {
      console.error('Error loading crop data:', error);
    }

    const systemPrompt = `You are an advanced AI assistant for AgriPredict, an agricultural yield prediction platform powered by ensemble ML models with 90-94% accuracy.

Your capabilities include:
1. **Accurate Yield Predictions**: When users ask for predictions, you can provide specific yield estimates in kg/ha based on historical data (2000-2024) for Indian states and crops. Use the ensemble model approach:
   - Linear Regression (Normal Equation)
   - Polynomial Regression (Degree 2)
   - Weighted K-Nearest Neighbors
   - Random Forest Ensemble (10 trees)
   - Gradient Boosting
   - Hybrid Ensemble combining all models

2. **Data Analysis**: Analyze trends, patterns, and insights from the historical agricultural data covering:
   - 28 Indian states
   - Major crops: Rice, Wheat, Maize, Cotton, Sugarcane, Groundnut, Chilli, Coconut, Tea, Coffee, etc.
   - 25 years of data (2000-2024)
   - Yield (MT), Area (Ha), Temperature ranges

3. **Agricultural Expertise**: Provide insights on:
   - Seasonal variations (Kharif, Rabi, Zaid, Whole Year)
   - State-specific agricultural practices
   - Climate and weather impacts
   - Optimal growing conditions

4. **Platform Guidance**: Help users navigate features:
   - Dashboard: Overview with key metrics and charts
   - Data Explorer: Interactive data visualization
   - Predict Yield: ML-powered predictions
   - Data Analysis: Comprehensive analytics

${cropDataContext}

**When providing predictions**:
- Use realistic values based on Indian agricultural data
- Include yield per hectare (kg/ha), recommended area, rainfall needs, temperature, humidity
- Mention confidence levels (0.85-0.94 for historical data, 0.6-0.75 for estimates)
- Consider seasonal and regional factors
- Explain the reasoning behind predictions

**Response Style**:
- Be precise and data-driven
- Use agricultural terminology correctly
- Provide actionable insights
- Keep responses clear and concise
- Always cite the ML model approach when making predictions

Remember: You're an expert agricultural AI assistant combining machine learning predictions with deep agricultural knowledge.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
