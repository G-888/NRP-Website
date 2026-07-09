import { Baby, Handshake, HeartHandshake, Scale, ScrollText, ShieldCheck } from "lucide-react";
import type { AdminContent } from "@/lib/admin-content";
import { lawyers, services } from "@/lib/site-data";

const iconMap = {
  shield: ShieldCheck,
  family: Baby,
  marriage: HeartHandshake,
  mediation: Handshake,
  estate: Scale,
  document: ScrollText
};

export function getManagedServices(adminContent: AdminContent) {
  const baseServices = services
    .filter((service) => !adminContent.hiddenServices.includes(service.title))
    .map((service) => ({
      ...service,
      ...(adminContent.services[service.title] ?? {})
    }));

  const customServices = adminContent.customServices.map((service) => ({
    ...service,
    icon: iconMap[service.iconKey] ?? ScrollText
  }));

  return [...baseServices, ...customServices];
}

export function getManagedLawyers(adminContent: AdminContent) {
  const baseLawyers = lawyers
    .filter((lawyer) => !adminContent.hiddenLawyers.includes(lawyer.name))
    .map((lawyer) => ({
      ...lawyer,
      ...(adminContent.lawyers[lawyer.name] ?? {})
    }));

  const customLawyers = adminContent.customLawyers.map((lawyer) => ({
    certificates: [],
    ...lawyer
  }));

  return [...baseLawyers, ...customLawyers];
}
