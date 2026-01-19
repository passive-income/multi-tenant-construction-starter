import beforeAfter from './beforeAfter';
import certification from './certification';
import client from './client';
import company from './company';
import contactSettings from './contactSettings';
import faq from './faq';
import footer from './footer';
import link from './link';
import navigation from './navigation';
import page from './page';
import project from './project';
import beforeAfterSection from './sections/beforeAfterSection';
import companySection from './sections/companySection';
import ctaSection from './sections/ctaSection';

// Section schemas
import heroSection from './sections/heroSection';
import imageSliderSection from './sections/imageSliderSection';
import projectsSection from './sections/projectsSection';
import servicesSection from './sections/servicesSection';
import testSection from './sections/testSection';
import service from './service';
import teamMember from './teamMember';
import testimonial from './testimonial';

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
    testSection,
  ],
};
