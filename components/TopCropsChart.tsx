"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jute", yield: 9548 },
  { name: "Ragi", yield: 5779 },
  { name: "Millet", yield: 3783 },
  { name: "Cashew", yield: 3650 },
  { name: "Tea", yield: 3550 },
  { name: "Potato", yield: 3500 },
  { name: "Rice", yield: 3450 },
  { name: "Gram", yield: 3400 },
];

export default function TopCropsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Crops by Yield</CardTitle>
        <CardDescription>Average yield per hectare</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Bar dataKey="yield" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
