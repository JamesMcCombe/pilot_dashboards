import { notFound } from "next/navigation";
import { NavigatorEconomicsView } from "@/components/copy-trading/navigator-economics-view";
import { getNavigatorEconomicsSnapshot } from "@/lib/aggregations";

interface NavigatorEconomicsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NavigatorEconomicsPage({ params }: NavigatorEconomicsPageProps) {
  const { id } = await params;
  const { navigator, relatedGroups, relatedPilots } = getNavigatorEconomicsSnapshot(id);

  if (!navigator) {
    notFound();
  }

  return <NavigatorEconomicsView navigator={navigator} groups={relatedGroups} pilots={relatedPilots} />;
}
