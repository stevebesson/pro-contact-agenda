import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, TrendingUp } from "lucide-react";

const stats = [
  {
    name: "Total Contacts",
    value: "0",
    icon: Users,
    description: "Contacts professionnels",
  },
  {
    name: "Rendez-vous",
    value: "0",
    icon: Calendar,
    description: "À venir cette semaine",
  },
  {
    name: "Notes",
    value: "0",
    icon: FileText,
    description: "Notes enregistrées",
  },
  {
    name: "Activité",
    value: "+0%",
    icon: TrendingUp,
    description: "Ce mois-ci",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de votre activité professionnelle
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.name}
            className="hover:shadow-lg transition-all duration-200 border-border"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Prochains rendez-vous</CardTitle>
            <CardDescription>Vos rendez-vous à venir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-8">
              Aucun rendez-vous prévu
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Contacts récents</CardTitle>
            <CardDescription>Derniers contacts ajoutés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-8">
              Aucun contact enregistré
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
