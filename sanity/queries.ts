export const siteSettingsQuery = `*[_type == "siteSettings"][0]{companyName, phone, email, address, enableAnimations}`;
export const servicesQuery = `*[_type == "service"] | order(title asc){title, slug, shortDescription, iconOrImage}`;
export const projectsQuery = `*[_type == "project"] | order(year desc){title, slug, year, location, gallery, services[]->{title, slug}}`;
