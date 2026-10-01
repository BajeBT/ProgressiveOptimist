// Built-in defaults for the About page leadership cards. The admin panel's
// "About Page" tab saves overrides to site settings (aboutLeadership); this is
// what the page shows until then.
export const defaultAboutLeadership = {
  officers: [
    {
      name: "Cameron Sobers",
      title: "Club President",
      role: "Executive Leadership & Strategic Direction",
      email: "president@progressiveoptimist.org",
      image: "/avatars/president_placeholder.jpg"
    },
    {
      name: "Sharon Mohammed",
      title: "Club Secretary & Treasurer",
      role: "Member Records, Official Communications & Financial Stewardship",
      email: "treasurer@progressiveoptimist.org",
      image: "/avatars/treasurer_placeholder.jpg"
    },
    {
      name: "Edwin Workman",
      title: "OI Representative",
      role: "Optimist International & Caribbean District Liaison (non-voting)",
      email: "oirep@progressiveoptimist.org",
      image: "/avatars/oirep_placeholder.jpg"
    }
  ],
  executiveRoles: [
    { title: "President", holder: "Cameron P. Sobers", badge: "Executive Head" },
    { title: "President Elect", holder: "", badge: "Leadership" },
    { title: "Vice President - Internal", holder: "Executive Committee", badge: "Internal Ops" },
    { title: "Vice President - External", holder: "Executive Committee", badge: "Outreach & Public" },
    { title: "Immediate Past President", holder: "Richelle Lucas", badge: "Advisory" },
    { title: "Secretary & Treasurer", holder: "Sharon Mohammed", badge: "Administration & Finance" },
    { title: "OI Representative", holder: "Edwin Workman", badge: "International (non-voting)" }
  ],
  directors: [
    { name: "Omolara DeRiggs-Morris", role: "Board Director & Past President (2023)", image: "/avatars/director_placeholder.jpg" },
    { name: "Dawn-Marie Watson", role: "Board Director", image: "/avatars/director_placeholder.jpg" },
    { name: "Deborah Bayne", role: "Board Director", image: "/avatars/director_placeholder.jpg" },
    { name: "Cameron Sobers", role: "President & Past President (2014)", image: "/avatars/director_placeholder.jpg" }
  ],
  pastPresidents: [
    { year: "2026", name: "Richelle Lucas" },
    { year: "2025", name: "Richelle Lucas" },
    { year: "2024", name: "Richelle Lucas" },
    { year: "2023", name: "Omolara DeRiggs Morris" },
    { year: "2022", name: "Edwin Workman" },
    { year: "2021", name: "Shaina McAllister" },
    { year: "2020", name: "Eleanor Rice" },
    { year: "2019", name: "Shirley Hoyte" },
    { year: "2018", name: "Maureen Dottin" },
    { year: "2017", name: "Charmaine London" },
    { year: "2016", name: "Margot Aquan", badge: "Distinguished" },
    { year: "2015", name: "Janelle Ottley" },
    { year: "2014", name: "Cameron Sobers", badge: "Distinguished" },
    { year: "2013", name: "Edwin Workman", badge: "Distinguished" },
    { year: "2012", name: "Simeon Ellis" },
    { year: "2011", name: "Carmel Haynes" },
    { year: "2010", name: "JoyAnn Carter", badge: "Charter Year" }
  ]
};
