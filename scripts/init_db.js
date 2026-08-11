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
    id: "rise-2025-summer",
    title: "RISE 2025 Summer Experience",
    category: "Youth Mentorship & Summer Camp",
    date: "May 2025",
    image: "https://progressiveoptimist.org/wp/wp-content/uploads/2025/05/RISE-Teens-Flyer-768x768.jpg",
    excerpt: "Reinvigorating & Inspiring Student Excellence — empowering teens with tools to BE YOU, BE SUCCESSFUL, and BE AWESOME!",
    content: "The RISE 2025 Summer Experience is the Progressive Optimist Club's flagship youth development initiative in Barbados. Designed to equip teens and primary students with essential life skills, conflict resolution, career mentorship, self-confidence, and interactive workshops.",
    impact: "150+ Teenagers & Youth Participated",
    isFeatured: true,
    author: "Progressive Optimist Board",
    authorId: "78008-0150",
    postedAt: "2025-05-15"
  },
  {
    id: "2025-easter-cheer",
    title: "2025 Easter Cheer & Kite Giveaway",
    category: "Community Outreach",
    date: "April 2025",
    image: "https://progressiveoptimist.org/wp/wp-content/uploads/2025/04/2025-Easter-Cheer-1-768x768.jpg",
    excerpt: "Annual Easter cheer kite giveaway celebrating traditional Bajan kite flying with primary school students.",
    content: "Bringing joy to young Bajans! The Progressive Optimist Club of Barbados distributed hand-crafted Easter kites, healthy treat packages, and educational books to students at Westbury Primary and Ignatius Byer Primary School.",
    impact: "200+ Kites & Gift Packages Delivered",
    isFeatured: true,
    author: "Richelle Lucas",
    authorId: "78008-0150",
    postedAt: "2025-04-12"
  },
  {
    id: "rise-challenge",
    title: "RISE Challenge Youth Empowerment",
    category: "Skill Building & Mentorship",
    date: "April 2025",
    image: "https://progressiveoptimist.org/wp/wp-content/uploads/2025/04/RISE-Flyer-768x982.jpg",
    excerpt: "Interactive student challenge building problem-solving skills, public speaking, and community leadership.",
    content: "An empowering youth challenge series where young participants solve real-world community puzzles, practice public speaking, and collaborate in teams under the mentorship of Optimist members.",
    impact: "80+ Students Completed Challenge",
    isFeatured: true,
    author: "Sharon Mohammed",
    authorId: "78008-0152",
    postedAt: "2025-04-05"
  },
  {
    id: "volunteers-june-2024",
    title: "Volunteers for the Month of June",
    category: "Volunteer Spotlight",
    date: "June 2024",
    image: "https://progressiveoptimist.org/wp/wp-content/uploads/2024/06/JuneVolunteers-768x768.jpg",
    excerpt: "Honoring our dedicated club volunteers and community members giving back to youth in Barbados.",
    content: "Celebrating the passionate Optimist volunteers who give their time, skills, and hearts to support educational programs, school visits, and community fundraisers across St. Michael and Barbados.",
    impact: "Special Member & Volunteer Recognition",
    isFeatured: false,
    author: "Richelle Lucas",
    authorId: "78008-0150",
    postedAt: "2024-06-01"
  },
  {
    id: "trivia-night-2023",
    title: "Trivia Night Fundraiser (Fri. Jun 2nd)",
    category: "Fundraiser & Fellowship",
    date: "June 2023",
    image: "https://progressiveoptimist.org/wp/wp-content/uploads/2023/05/TriviaNight-Jun2023-768x994.jpg",
    excerpt: "An exciting evening of general knowledge trivia, fellowship, prizes, and fundraising for student initiatives.",
    content: "Our annual Trivia Night fundraiser brought together community members, Optimist members, and friends for friendly competition. All proceeds went directly toward purchasing school supplies and funding student mentorship camps.",
    impact: "Raised Funds for Youth School Supplies",
    isFeatured: false,
    author: "Edwin Workman",
    authorId: "78008-0021",
    postedAt: "2023-05-20"
  },
  {
    id: "mini-millionaires-2022",
    title: "Mini Millionaires In The Making Mentorship",
    category: "Financial Literacy & Mentorship",
    date: "June 2022",
    image: "https://progressiveoptimist.org/wp/wp-content/uploads/2022/06/Mini-768x1365.jpg",
    excerpt: "Entrepreneurship and financial literacy mentorship program teaching Bajan children money management.",
    content: "Register now for Mini Millionaires In The Making! A practical, fun-filled workshop introducing children to saving, budgeting, ethical business concepts, and entrepreneurship.",
    impact: "45 Children Mentored in Business",
    isFeatured: false,
    author: "Sharon Mohammed",
    authorId: "78008-0152",
    postedAt: "2022-06-10"
  },
  {
    id: "healthy-eating-westbury",
    title: "Healthy Eating For Healthy Living at Westbury Primary",
    category: "Health & Nutrition",
    date: "April 2022",
    image: "https://progressiveoptimist.org/wp/wp-content/uploads/2022/04/Produce-Donation-at-Westbury-Primary-1-0-768x576.jpeg",
    excerpt: "Donating fresh local produce and hosting nutritional awareness workshops at Westbury Primary School.",
    content: "As part of our commitment to childhood wellness, club members donated fresh local fruits and vegetables to Westbury Primary School and hosted interactive healthy eating sessions for students.",
    impact: "120+ Primary Students Reached",
    isFeatured: false,
    author: "Richelle Lucas",
    authorId: "78008-0150",
    postedAt: "2022-04-18"
  },
  {
    id: "easter-cheer-ignatius-byer",
    title: "Easter Cheer & Kite Donation at Ignatius Byer Primary",
    category: "Primary School Outreach",
    date: "April 2022",
    image: "https://progressiveoptimist.org/wp/wp-content/uploads/2022/04/Kite-Donation-7-0-768x576.jpeg",
    excerpt: "Spreading Easter cheer and kite-flying traditions with students at Ignatius Byer Primary School.",
    content: "Bringing smiles to Ignatius Byer Primary School! Club officers presented colorful handmade kites and holiday treats to students, preserving Bajan Easter heritage.",
    impact: "Ignatius Byer Students Supported",
    isFeatured: false,
    author: "Edwin Workman",
    authorId: "78008-0021",
    postedAt: "2022-04-14"
  },
  {
    id: "ignatius-byer-stem-books",
    title: "STEM Books Presentation to Ignatius Byer Primary",
    category: "Education & STEM",
    date: "March 2022",
    image: "https://progressiveoptimist.org/wp/wp-content/uploads/2022/03/Ignatius-Byer-Donation-6-0-768x1024.jpg",
    excerpt: "Donating science, technology, engineering, and mathematics books to enhance the school library.",
    content: "Promoting literacy and STEM curiosity among young learners! The Progressive Optimist Club donated a collection of STEM books and learning materials to the library at Ignatius Byer Primary School.",
    impact: "New STEM Library Collection Donated",
    isFeatured: false,
    author: "Richelle Lucas",
    authorId: "78008-0150",
    postedAt: "2022-03-25"
  },
  {
    id: "tree-planting-zone9",
    title: "Community Tree Planting (Zone 9 Environment Project)",
    category: "Environment & Sustainability",
    date: "March 2022",
    image: "https://progressiveoptimist.org/wp/wp-content/uploads/2022/03/POCB-Tree-Planting-1-0-768x1024.jpeg",
    excerpt: "Planting shade and fruit trees around school grounds and community parks in Barbados.",
    content: "Promoting environmental stewardship! Optimist members and youth volunteers joined hands to plant trees, fostering green spaces and educating students on climate responsibility.",
    impact: "Environmental Greening & Education",
    isFeatured: false,
    author: "Edwin Workman",
    authorId: "78008-0021",
    postedAt: "2022-03-18"
  },
  {
    id: "christmas-charm-outreach-2021",
    title: "Christmas CHaRM Outreach & Childhood Cancer Support (2021)",
    category: "Childhood Health & Care",
    date: "December 2021",
    image: "https://progressiveoptimist.org/wp/wp-content/uploads/2022/03/2021-Christmas-Cheer-768x768.png",
    excerpt: "Special Christmas outreach delivering food hampers, toys, and childhood cancer care support packages.",
    content: "CHaRM (Children's Health and Wellness) holiday initiative supporting children battling childhood cancer and underprivileged families in Barbados during the Christmas season.",
    impact: "Holiday Hampers & Care Packages",
    isFeatured: false,
    author: "Sharon Mohammed",
    authorId: "78008-0152",
    postedAt: "2021-12-20"
  },
  {
    id: "karaoke-bingo-2020",
    title: "Karaoke Bingo Fundraiser Night (2020)",
    category: "Fundraiser & Fellowship",
    date: "January 2020",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
    excerpt: "A fun-filled evening of music, bingo games, singing, and community fundraising.",
    content: "Combining musical karaoke with classic bingo games! Community members and Optimist friends gathered for an entertaining fundraiser to support our youth academic scholarships.",
    impact: "Raised Scholarship Funds",
    isFeatured: false,
    author: "Paul Nurse",
    authorId: "78008-0165",
    postedAt: "2020-01-15"
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
      await sql`
        INSERT INTO members (id, name, gender, email, phone, address, join_date, sponsor, role, is_treasurer, is_president, avatar)
        VALUES (
          ${m.id}, ${m.name}, ${m.gender}, ${m.email}, ${m.phone}, ${m.address}, 
          ${m.joinDate}, ${m.sponsor}, ${m.role}, 
          ${m.id === '78008-0152'}, ${m.id === '78008-0150'},
          ${`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.email)}`}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          role = EXCLUDED.role;
      `;

      // Seed dues ledgers separately
      await sql`
        INSERT INTO dues_ledger (member_id, fiscal_year, dues_rate, amount_paid, balance_due, payment_method, dues_status, last_payment_date, notes, email_last_sent)
        VALUES (
          ${m.id}, '2025/2026 (Oct 1 - Sep 30)', '$250.00 BBD', '$250.00 BBD', '$0.00 BBD', 
          'Bank Transfer', 'Active Member (2025/2026)', '2025-10-01', 'Annual dues paid in full.', '2025-10-01'
        )
        ON CONFLICT DO NOTHING;
      `;
    }

    // 5. Seed actual Projects & Events
    console.log("Cleaning and seeding actual live Projects & Events...");
    await sql`TRUNCATE TABLE projects;`;
    for (const p of initialProjects) {
      await sql`
        INSERT INTO projects (id, title, category, date_str, image, excerpt, content, impact, is_featured, author, author_id, posted_at)
        VALUES (${p.id}, ${p.title}, ${p.category}, ${p.date}, ${p.image}, ${p.excerpt}, ${p.content}, ${p.impact}, ${p.isFeatured}, ${p.author}, ${p.authorId}, ${p.postedAt});
      `;
    }

    console.log("Database initialized & seeded successfully!");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

initializeDatabase();
