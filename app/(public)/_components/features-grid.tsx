import { BarChart3, FileText, MessageSquare, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FeaturesGrid() {
  const features = [
    {
      icon: MessageSquare,
      title: "Intelligent Chat",
      description:
        "Engage in natural conversations with AI models that understand context and provide accurate responses.",
    },
    {
      icon: FileText,
      title: "Document Creation",
      description:
        "Generate and edit documents, code, and spreadsheets with AI assistance.",
    },
    {
      icon: BarChart3,
      title: "Usage Analytics",
      description:
        "Track your AI usage, token consumption, and conversation history.",
    },
    {
      icon: Settings,
      title: "Customizable",
      description:
        "Choose from multiple AI models and customize your experience.",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-12 text-center font-bold text-3xl">
        Everything you need to work with AI
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <feature.icon className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
