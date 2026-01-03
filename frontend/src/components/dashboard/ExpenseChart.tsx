import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LayoutDashboard } from "lucide-react";
import { formatCurrency } from "@/utils/calculations";

interface ChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface ExpenseChartProps {
  chartData: ChartData[];
  totalExpenses: number;
}

export default function ExpenseChart({ chartData, totalExpenses }: ExpenseChartProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-zinc-200">Distribuição de Gastos</h3>
      </div>
      <div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/5 flex items-center justify-center relative min-h-[320px] hover:bg-white/[0.04] transition-all">
        {chartData.length > 0 ? (
          <div className="w-full h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.05)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    backdropFilter: 'blur(20px)',
                    color: '#fff',
                    padding: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                <p className="text-xs font-medium text-zinc-400 uppercase mb-1">Total</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-3 text-zinc-500">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <p className="text-zinc-400 font-medium">Sem dados de gastos</p>
            <p className="text-zinc-600 text-sm mt-1">Adicione despesas para ver o gráfico</p>
          </div>
        )}
      </div>
    </section>
  );
}
