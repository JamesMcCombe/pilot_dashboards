import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBlueprintAnalyticsRows } from "@/lib/aggregations";
import { formatCurrency } from "@/lib/formatters";
import { HelpTooltip } from "@/components/help/help-tooltip";

export function BlueprintAnalyticsCard() {
  const rows = getBlueprintAnalyticsRows();

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85 shadow-none">
      <CardHeader>
        <HelpTooltip text="Blueprint performance metrics so you can explain which strategies are selling and retaining copiers." asChild indicator={false}>
          <CardTitle className="text-base font-semibold">Blueprint Analytics</CardTitle>
        </HelpTooltip>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Strategies driving copy adoption</p>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40">
              <TableHead>
                <HelpTooltip text="Name of the strategy or blueprint being sold." asChild indicator={false}>
                  <span>Blueprint</span>
                </HelpTooltip>
              </TableHead>
              <TableHead>
                <HelpTooltip text="Units sold in the last 30 days." asChild indicator={false}>
                  <span>Sales 30d</span>
                </HelpTooltip>
              </TableHead>
              <TableHead>
                <HelpTooltip text="Percent of purchasers actively using the blueprint." asChild indicator={false}>
                  <span>Adoption</span>
                </HelpTooltip>
              </TableHead>
              <TableHead>
                <HelpTooltip text="Share of blueprint users retained after 30 days." asChild indicator={false}>
                  <span>Retention 30d</span>
                </HelpTooltip>
              </TableHead>
              <TableHead>
                <HelpTooltip text="Broker revenue generated from this blueprint over the last 30 days." asChild indicator={false}>
                  <span>Broker Rev 30d</span>
                </HelpTooltip>
              </TableHead>
              <TableHead>
                <HelpTooltip text="Average P&L each user realises with this blueprint – useful proof point." asChild indicator={false}>
                  <span>Avg User P&L</span>
                </HelpTooltip>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name} className="border-border/10">
                <TableCell className="font-semibold text-foreground">{row.name}</TableCell>
                <TableCell>{row.sales30d}</TableCell>
                <TableCell>{row.adoptionRate}%</TableCell>
                <TableCell>{row.retention30d}%</TableCell>
                <TableCell>{formatCurrency(row.brokerRevenue30d)}</TableCell>
                <TableCell>{formatCurrency(row.avgUserPnL)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
