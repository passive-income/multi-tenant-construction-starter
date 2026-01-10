import client from "./client";
import company from "./company";
import service from "./service";
import project from "./project";
import footer from "./footer";
import navigation from "./navigation";
import beforeAfter from "./beforeAfter";
import link from "./link";
import page from "./page";
import testimonial from "./testimonial";
import faq from "./faq";
import contactSettings from "./contactSettings";
import teamMember from "./teamMember";
import certification from "./certification";

// Section schemas
import heroSection from "./sections/heroSection";
import servicesSection from "./sections/servicesSection";
import beforeAfterSection from "./sections/beforeAfterSection";
import companySection from "./sections/companySection";
import projectsSection from "./sections/projectsSection";
import ctaSection from "./sections/ctaSection";
import imageSliderSection from "./sections/imageSliderSection";

export const schema = {
  types: [
    client,
    company,
    service,
    project,
    footer,
    navigation,
    beforeAfter,
    link,
    page,
    testimonial,
    faq,
    contactSettings,
    teamMember,
    certification,
    // Section types
    heroSection,
    servicesSection,
    beforeAfterSection,
    companySection,
    projectsSection,
    ctaSection,
    imageSliderSection,
  ],
};
