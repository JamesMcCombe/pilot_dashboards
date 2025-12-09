import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-3xl border-2 border-border/60 bg-card/80 shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-semibold text-foreground">
            Settings (placeholder)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Toggle scaffolds represent future broker preferences, notifications, and integrations.
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {["Email digests", "SMS escalation", "Navigator approvals"].map((label) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-2xl border border-border/40 bg-sidebar/40 px-4 py-3"
            >
              <span>{label}</span>
              <Switch disabled defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
