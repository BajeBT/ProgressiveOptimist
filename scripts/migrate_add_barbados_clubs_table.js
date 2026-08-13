import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

// Admin-editable Barbados club directory entries. Seeded with the clubs
// previously hardcoded in src/pages/BarbadosClubsPage.jsx so nothing changes
// visibly on deploy.
const defaultClubs = [
  {
    name: "Progressive Optimist Club of Barbados",
    motto: "Bringing Out The Best In Children",
    charterYear: "2010",
    isHost: true,
    location: "Lloyd Erskine Sandiford Centre (LESC), Two Mile Hill, St. Michael, Barbados",
    meetingSchedule: "1st Monday of every month at 5:30 PM",
    email: "info@progressiveoptimist.org",
    phone: "+1 (246) 836-6185",
    website: "https://progressiveoptimist.org",
    description: "The Progressive Optimist Club of Barbados is dedicated to empowering youth through education, mentorship, healthy living initiatives, and community service across Barbados.",
    initiatives: [
      "RISE Summer Experience & Challenge",
      "Easter Cheer Kite Giveaway (Westbury & Ignatius Byer Primary)",
      "Laptop & Tablet Fundraiser for Students",
      "Mini Millionaires in the Making Mentorship"
    ]
  },
  {
    name: "Optimist Club of Barbados Bridgetown",
    motto: "Friend of Youth",
    charterYear: "1994",
    isHost: false,
    location: "Bridgetown, St. Michael, Barbados",
    meetingSchedule: "2nd & 4th Tuesday of every month at 6:00 PM",
    email: "bridgetownoptimist@gmail.com",
    phone: "+1 (246) 426-0000",
    website: "https://oicaribbean.org",
    description: "Sponsoring club of Progressive Optimist. One of the founding Optimist clubs in Barbados supporting youth Oratorical and Essay contests.",
    initiatives: [
      "OI Oratorical & Essay Contest Barbados",
      "Youth Leadership Workshops",
      "Child Development Grants"
    ]
  },
  {
    name: "Optimist Club of St. Michael Barbados",
    motto: "Inspiring Hope and Positive Vision",
    charterYear: "2002",
    isHost: false,
    location: "St. Michael Parish, Barbados",
    meetingSchedule: "1st & 3rd Wednesday at 5:30 PM",
    email: "stmichaeloptimist@gmail.com",
    phone: "+1 (246) 436-1216",
    website: "https://oicaribbean.org",
    description: "Serving children in the greater St. Michael area with primary school reading initiatives and youth sports sponsorship.",
    initiatives: [
      "Primary School Literacy Project",
      "Youth Track & Field Support",
      "Community Food Bank Drives"
    ]
  },
  {
    name: "Optimist Club of Barbados South",
    motto: "Bringing Out The Best in Our Community",
    charterYear: "2015",
    isHost: false,
    location: "Christ Church & South Coast, Barbados",
    meetingSchedule: "3rd Thursday of every month at 6:00 PM",
    email: "southbarbadosoptimist@gmail.com",
    phone: "+1 (246) 428-9901",
    website: "https://oicaribbean.org",
    description: "Active south coast club focusing on environmental preservation, beach cleanups, and youth marine safety workshops.",
    initiatives: [
      "Coastal Environmental Conservation",
      "Junior Lifeguard & Swim Safety",
      "Secondary School Mentorship"
    ]
  }
];

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS barbados_clubs (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      motto TEXT,
      charter_year VARCHAR(10),
      is_host BOOLEAN DEFAULT FALSE,
      location TEXT,
      meeting_schedule TEXT,
      email TEXT,
      phone TEXT,
      website TEXT,
      description TEXT,
      initiatives TEXT[] DEFAULT '{}',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log("barbados_clubs table ready.");

  const count = await sql`SELECT COUNT(*)::int AS n FROM barbados_clubs;`;
  if (count[0].n === 0) {
    for (let i = 0; i < defaultClubs.length; i++) {
      const c = defaultClubs[i];
      await sql`
        INSERT INTO barbados_clubs (
          name, motto, charter_year, is_host, location, meeting_schedule,
          email, phone, website, description, initiatives, sort_order
        )
        VALUES (
          ${c.name}, ${c.motto}, ${c.charterYear}, ${c.isHost}, ${c.location}, ${c.meetingSchedule},
          ${c.email}, ${c.phone}, ${c.website}, ${c.description}, ${c.initiatives}, ${i}
        );
      `;
    }
    console.log(`Seeded ${defaultClubs.length} default club(s).`);
  } else {
    console.log(`Table already has ${count[0].n} row(s), skipped seeding.`);
  }
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
