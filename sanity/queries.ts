export const siteSettingsQuery = `*[_type == "siteSettings"][0]{companyName, phone, email, address, enableAnimations}`;
export const servicesQuery = `*[_type == "service"] | order(title asc){title, slug, shortDescription, iconOrImage}`;
export const projectsQuery = `*[_type == "project"] | order(year desc){title, slug, year, location, gallery, services[]->{title, slug}}`;

// DACH Features Queries
export const testimonialsQuery = `*[_type == "testimonial" && clientId == $clientId] | order(featured desc, date desc) {
  _id,
  _type,
  name,
  company,
  position,
  image,
  rating,
  text,
  projectRef->{_id, title, slug},
  serviceRef->{_id, title, slug},
  date,
  location,
  clientId,
  featured
}`;

export const faqQuery = `*[_type == "faq" && clientId == $clientId] | order(order asc) {
  _id,
  _type,
  question,
  answer,
  category,
  order,
  clientId
}`;

export const teamMembersQuery = `*[_type == "teamMember" && clientId == $clientId] | order(order asc) {
  _id,
  _type,
  name,
  position,
  image,
  bio,
  phone,
  email,
  specializations,
  order,
  clientId
}`;

export const certificationsQuery = `*[_type == "certification" && clientId == $clientId] | order(validFrom desc) {
  _id,
  _type,
  name,
  issuer,
  logo,
  certificateNumber,
  validFrom,
  validUntil,
  description,
  clientId
}`;

export const contactSettingsQuery = `*[_type == "contactSettings" && clientId == $clientId][0] {
  _id,
  _type,
  email,
  phone,
  whatsappNumber,
  showMap,
  mapAddress,
  formFields,
  clientId
}`;
