import { Baby, BookOpenText, BriefcaseBusiness, Handshake, HeartHandshake, Landmark, Scale, ScrollText, ShieldCheck } from "lucide-react";
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

  const customServices = adminContent.customServices.map((service, index) => ({
    ...service,
    slug: service.slug ?? `custom-service-${index + 1}`,
    icon: iconMap[service.iconKey] ?? ScrollText
  }));

  return [...baseServices, ...customServices];
}

export function getManagedLawyers(adminContent: AdminContent) {
  const baseLawyers = lawyers
    .filter((lawyer) => !adminContent.hiddenLawyers.includes(lawyer.name))
    .map((lawyer) => {
      const override = adminContent.lawyers[lawyer.name] ?? {};
      const { displayName, ...values } = override;
      const certificates = Object.prototype.hasOwnProperty.call(adminContent.certificates, lawyer.name)
        ? adminContent.certificates[lawyer.name]
        : lawyer.certificates;
      return { ...lawyer, ...values, certificates, name: displayName || lawyer.name };
    });

  const customLawyers = adminContent.customLawyers.map((lawyer) => ({
    certificates: [],
    ...lawyer
  }));

  return [...baseLawyers, ...customLawyers];
}

export function getManagedFirm(adminContent: AdminContent) {
  const site = adminContent.site;
  const digits = site.whatsappNumber.replace(/\D/g, "");
  const localPhone = site.phoneDisplay.replace(/\D/g, "");
  const phoneNumber = localPhone.startsWith("0") ? `6${localPhone}` : localPhone;
  return {
    ...site,
    whatsappNumber: digits,
    phoneHref: `tel:+${phoneNumber}`,
    whatsappHref: `https://wa.me/${digits}?text=${encodeURIComponent("Assalamualaikum, saya ingin membuat temujanji konsultasi guaman Syarie.")}`,
    emailHref: `mailto:${site.email}`
  };
}

const whyIconMap = {
  court: Landmark,
  advice: BookOpenText,
  professional: BriefcaseBusiness,
  rights: Scale
};

export function getManagedWhyChooseUs(adminContent: AdminContent) {
  return adminContent.whyChooseUs.map((item) => ({ ...item, icon: whyIconMap[item.iconKey] ?? Scale }));
}
