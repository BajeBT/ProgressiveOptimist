import { neon } from '@neondatabase/serverless';

const NEON_DB_URL = "postgresql://neondb_owner:npg_g3Y2MVzbDSrn@ep-cold-bird-axj0in93-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";
const sql = neon(NEON_DB_URL);

const all21Members = [
  { id: "78008-0153", name: "Deborah Bayne", gender: "F", email: "deborahbayne46@gmail.com", phone: "+1 (246) 423-8636", address: "7 Pluma Close, Crane Haven, St. Philip, BB", joinDate: "05/27/2010", sponsor: "Charter Member", role: "Board Director" },
  { id: "78008-0022", name: "Sylvia A Blackman", gender: "F", email: "sylvia.blackman1@gmail.com", phone: "+1 (246) 420-1490 / 231-5085", address: "Lotus, Welches, Christ Church, BB17056 BB", joinDate: "05/27/2010", sponsor: "Charter Member", role: "Active Member" },
  { id: "78008-0148", name: "Lisa Brome", gender: "F", email: "lisabrome@yahoo.com", phone: "+1 (246) 438-6612", address: "14 Bakers Tenantry, St. Peter, BB", joinDate: "05/27/2010", sponsor: "Charter Member", role: "Active Member" },
  { id: "78008-0052", name: "Maureen E Dottin", gender: "F", email: "mdottin@caribsurf.com", phone: "+1 (246) 425-4203", address: "Hothersal Turning, St. Michael, BB11038 BB", joinDate: "05/27/2010", sponsor: "Charter Member", role: "Foundation Rep-Elect" },
  { id: "78008-0010", name: "Charmaine London", gender: "F", email: "londoncharms@hotmail.com", phone: "+1 (246) 425-1073 / 822-1925", address: "3rd Ave Grazettes, St. Michael, BB12033 BB", joinDate: "05/27/2010", sponsor: "Charter Member", role: "Club Secretary" },
  { id: "78008-0150", name: "Richelle Lucas", gender: "F", email: "richelle.lucas16@gmail.com", phone: "+1 (246) 432-0995 / 230-0000", address: "#45 Vespera Gardens, Lancaster, St. James, BB", joinDate: "05/27/2010", sponsor: "Charter Member", role: "Club President & Admin" },
  { id: "78008-0152", name: "Sharon Mohammed", gender: "F", email: "sharon@topaz-bb.com", phone: "+1 (246) 427-0248", address: "Brathwaite Gap, Dayrells Road, Christ Church, BB14016 BB", joinDate: "05/27/2010", sponsor: "Charter Member", role: "Club Treasurer & Admin" },
  { id: "78008-0038", name: "Cameron P Sobers", gender: "M", email: "Cposobers@gmail.com", phone: "+1 (246) 437-9790", address: "209 3rd Avenue, Rowans Park South, St. George, BB19036 BB", joinDate: "05/27/2010", sponsor: "Charter Member", role: "Board Director & President-Elect" },
  { id: "78008-0021", name: "Edwin Workman", gender: "M", email: "edwin@jillandee.com", phone: "+1 (246) 425-0121 / 826-5120", address: "2 Jackson Terrace, St. Michael, BB14014 BB", joinDate: "05/27/2010", sponsor: "Charter Member", role: "Foundation Representative" },
  { id: "78008-0121", name: "Omolara De Riggs-Morris", gender: "F", email: "onderiggs@hotmail.com", phone: "+1 (246) 571-0026", address: "Windy Ridge, Thornbury Hill, Christ Church, BB12003 BB", joinDate: "09/12/2012", sponsor: "Richelle Lucas", role: "Board Director" },
  { id: "78008-0130", name: "Doreen M Agard", gender: "F", email: "doreen.agard@gmail.com", phone: "+1 (246) 426-3104", address: "Rockley New Road, Christ Church, BB", joinDate: "03/15/2014", sponsor: "Sharon Mohammed", role: "Active Member" },
  { id: "78008-0135", name: "Janelle S Bradshaw", gender: "F", email: "janellebradshaw@gmail.com", phone: "+1 (246) 436-8911", address: "Pine Gardens, St. Michael, BB", joinDate: "06/10/2015", sponsor: "Charmaine London", role: "Active Member" },
  { id: "78008-0140", name: "Tricia C Cave", gender: "F", email: "tricia.cave@gmail.com", phone: "+1 (246) 429-1002", address: "Hastings, Christ Church, BB", joinDate: "11/20/2016", sponsor: "Maureen Dottin", role: "Active Member" },
  { id: "78008-0142", name: "Earle L Forde", gender: "M", email: "earleforde@gmail.com", phone: "+1 (246) 424-5510", address: "Wanstead Gardens, St. James, BB", joinDate: "02/14/2017", sponsor: "Edwin Workman", role: "Active Member" },
  { id: "78008-0144", name: "Janelle C Goddard", gender: "F", email: "janellegoddard@gmail.com", phone: "+1 (246) 435-0012", address: "Wildey Heights, St. Michael, BB", joinDate: "05/05/2018", sponsor: "Sharon Mohammed", role: "Active Member" },
  { id: "78008-0146", name: "Karen M Haynes", gender: "F", email: "karenhaynes@gmail.com", phone: "+1 (246) 428-9901", address: "Oistins, Christ Church, BB", joinDate: "09/18/2019", sponsor: "Richelle Lucas", role: "Active Member" },
  { id: "78008-0155", name: "Corey L Jordan", gender: "M", email: "coreyjordan@gmail.com", phone: "+1 (246) 430-1122", address: "Warrens Terrace, St. Thomas, BB", joinDate: "01/12/2021", sponsor: "Cameron Sobers", role: "Active Member" },
  { id: "78008-0160", name: "Keisha A Marshall", gender: "F", email: "keishamarshall@gmail.com", phone: "+1 (246) 421-4455", address: "Prospect, St. James, BB", joinDate: "04/22/2022", sponsor: "Deborah Bayne", role: "Active Member" },
  { id: "78008-0165", name: "Paul G Nurse", gender: "M", email: "paulnurse@gmail.com", phone: "+1 (246) 437-0099", address: "Clapham, St. Michael, BB", joinDate: "08/14/2023", sponsor: "Omolara De Riggs-Morris", role: "Active Member" },
  { id: "78008-0170", name: "Stacy L Trotman", gender: "F", email: "stacytrotman@gmail.com", phone: "+1 (246) 427-8822", address: "Brittons Hill, St. Michael, BB", joinDate: "11/02/2024", sponsor: "Charmaine London", role: "Active Member" },
  { id: "78008-0175", name: "Trevor K Yearwood", gender: "M", email: "trevoryearwood@gmail.com", phone: "+1 (246) 431-7788", address: "Rendezvous, Christ Church, BB", joinDate: "02/10/2025", sponsor: "Richelle Lucas", role: "Active Member" }
];

const initialProjects = [
  {
    id: "proj-1",
    title: "RISE Summer Experience 2025",
    category: "Youth Empowerment",
    date: "July 2025",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Our flagship annual summer program empowering Bajan youth with leadership, STEM workshops, and conflict resolution skills.",
    content: "The RISE Summer Experience brings together primary and secondary students across Barbados for an immersive 2-week workshop. Participants engage in interactive robotics challenges, public speaking mentorship, environmental conservation projects, and life-skills training led by Optimist volunteers and guest Bajan professionals.",
    impact: "Impacted 120 Bajan Children",
    isFeatured: true,
    author: "Richelle Lucas",
    authorId: "78008-0150",
    postedAt: "2025-07-15"
  },
  {
    id: "proj-2",
    title: "Annual Primary School Laptop & Tablet Drive",
    category: "Education & Technology",
    date: "September 2025",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Donating refurbished laptops and digital tablets to underserved primary school students across St. Michael and Christ Church.",
    content: "Digital inclusion is critical for modern education in Barbados. Through corporate partnerships and fundraising drives, Progressive Optimist Club donated 45 laptops and tablets to deserving students at Westbury Primary, St. Mary's Primary, and St. Giles Primary schools.",
    impact: "45 Devices Donated",
    isFeatured: true,
    author: "Sharon Mohammed",
    authorId: "78008-0152",
    postedAt: "2025-09-10"
  },
  {
    id: "proj-3",
    title: "Easter Kite & Joy Giveaway at Westbury Primary",
    category: "Community Outreach",
    date: "April 2025",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Bringing traditional Bajan Easter kite-flying cheer, stationery packs, and healthy snacks to over 150 primary school children.",
    content: "Celebrating Bajan culture and Easter traditions! Optimist members spent the morning teaching children how to craft traditional Bajan paper kites, followed by an afternoon of kite flying, storytelling, and handing out school supply care packages.",
    impact: "150 Children Reached",
    isFeatured: false,
    author: "Edwin Workman",
    authorId: "78008-0021",
    postedAt: "2025-04-18"
  }
];

async function initializeDatabase() {
  console.log("Connecting to Neon Serverless PostgreSQL...");

  try {
    // 1. Create members table
    console.log("Creating table 'members'...");
    await sql`
      CREATE TABLE IF NOT EXISTS members (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        gender VARCHAR(10),
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(100),
        address TEXT,
        join_date VARCHAR(50),
        sponsor VARCHAR(255),
        role VARCHAR(100) NOT NULL DEFAULT 'Active Member',
        is_treasurer BOOLEAN DEFAULT FALSE,
        is_president BOOLEAN DEFAULT FALSE,
        avatar TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Create dues_ledger table
    console.log("Creating table 'dues_ledger'...");
    await sql`
      CREATE TABLE IF NOT EXISTS dues_ledger (
        id SERIAL PRIMARY KEY,
        member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
        fiscal_year VARCHAR(50) DEFAULT '2025/2026 (Oct 1 - Sep 30)',
        dues_rate VARCHAR(50) DEFAULT '$250.00 BBD',
        amount_paid VARCHAR(50) DEFAULT '$250.00 BBD',
        balance_due VARCHAR(50) DEFAULT '$0.00 BBD',
        payment_method VARCHAR(100) DEFAULT 'Bank Transfer',
        dues_status VARCHAR(100) DEFAULT 'Active Member (2025/2026)',
        last_payment_date VARCHAR(50),
        notes TEXT,
        email_last_sent VARCHAR(50),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Create projects table
    console.log("Creating table 'projects'...");
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        date_str VARCHAR(100),
        image TEXT,
        excerpt TEXT,
        content TEXT,
        impact VARCHAR(255),
        is_featured BOOLEAN DEFAULT FALSE,
        author VARCHAR(255),
        author_id VARCHAR(50),
        posted_at VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Seed 21 Active Members & Dues Records
    console.log("Seeding 21 Active Members and Dues Ledgers into Neon DB...");
    for (const m of all21Members) {
      const isTreasurer = m.email === 'sharon@topaz-bb.com' || m.email === 'treasurer@progressiveoptimist.org';
      const isPresident = m.email === 'richelle.lucas16@gmail.com';
      const avatar = isTreasurer ? '/avatars/treasurer_placeholder.jpg' : isPresident ? '/avatars/president_placeholder.jpg' : `/avatars/director_placeholder.jpg`;
      const isPending = m.email === 'lisabrome@yahoo.com';

      // Insert Member
      await sql`
        INSERT INTO members (id, name, gender, email, phone, address, join_date, sponsor, role, is_treasurer, is_president, avatar)
        VALUES (${m.id}, ${m.name}, ${m.gender}, ${m.email}, ${m.phone}, ${m.address}, ${m.joinDate}, ${m.sponsor}, ${m.role}, ${isTreasurer}, ${isPresident}, ${avatar})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          role = EXCLUDED.role,
          is_treasurer = EXCLUDED.is_treasurer,
          is_president = EXCLUDED.is_president;
      `;

      // Insert Dues Ledger
      await sql`
        INSERT INTO dues_ledger (member_id, fiscal_year, dues_rate, amount_paid, balance_due, payment_method, dues_status, last_payment_date, notes, email_last_sent)
        VALUES (
          ${m.id},
          '2025/2026 (Oct 1 - Sep 30)',
          '$250.00 BBD',
          ${isPending ? '$0.00 BBD' : '$250.00 BBD'},
          ${isPending ? '$250.00 BBD' : '$0.00 BBD'},
          ${isPending ? 'Pending' : 'Bank Transfer'},
          ${isPending ? 'Pending Dues Payment' : 'Active Member (2025/2026)'},
          ${isPending ? 'None' : '2025-10-01'},
          ${isPending ? 'Awaiting 2025/2026 annual renewal statement.' : 'Full annual dues paid via Scotiabank transfer.'},
          '2025-10-01'
        );
      `;
    }

    // 5. Seed Projects
    console.log("Seeding Community Projects into Neon DB...");
    for (const p of initialProjects) {
      await sql`
        INSERT INTO projects (id, title, category, date_str, image, excerpt, content, impact, is_featured, author, author_id, posted_at)
        VALUES (${p.id}, ${p.title}, ${p.category}, ${p.date}, ${p.image}, ${p.excerpt}, ${p.content}, ${p.impact}, ${p.isFeatured}, ${p.author}, ${p.authorId}, ${p.postedAt})
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    console.log("SUCCESS: Neon PostgreSQL Master Database fully initialized and seeded!");
  } catch (err) {
    console.error("ERROR initializing Neon Database:", err);
    process.exit(1);
  }
}

initializeDatabase();
