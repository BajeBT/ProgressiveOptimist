import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { initialProjects } from '../src/data/projectsData.js';

const sql = neon(process.env.NEON_DATABASE_URL);

const all21Members = [
  {
    "id": "78008-0153",
    "name": "Deborah Bayne",
    "gender": "F",
    "email": "deborahbayne46@gmail.com",
    "phone": "Cell: (246) 231-0728",
    "address": "7 Pluma Close, Crane Haven, St Philip, BB",
    "joinDate": "06/02/2025",
    "sponsor": "Lucas, Richelle (78008-0150)",
    "role": "Club Board of Director",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0148",
    "name": "Lisa Brome",
    "gender": "F",
    "email": "lisa.brome@gmail.com",
    "phone": "Cell: (246) 264-7810",
    "address": "#24 Ashby Drive, Enterprise, Christ Church, BB",
    "joinDate": "09/30/2022",
    "sponsor": "Goodridge, Shaina (78008-0064)",
    "role": "Active Member",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0093",
    "name": "Joy-Ann M Codrington",
    "gender": "F",
    "email": "jamacod@hotmail.com",
    "phone": "Home: (246) 228-5871 / Work: (246) 432-5050",
    "address": "Rouen Road, Belle Gully, Bridgetown, BB 11058, BB",
    "joinDate": "07/28/2016",
    "sponsor": "Parris, Rozanne (78008-0068)",
    "role": "Active Member",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0121",
    "name": "Omolara De Riggs-Morris",
    "gender": "F",
    "email": "onderiggs@hotmail.com",
    "phone": "Home: (428) 291-7 / Work: (417) 681-0 / Cell: (234) 051-8",
    "address": "Windy Ridge, Thornbury Hill, Christ Church, BB12093, BB",
    "joinDate": "07/05/2018",
    "sponsor": "Bostic, Jennifer (78008-0079)",
    "role": "Club Board of Director",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0052",
    "name": "Maureen E Dottin",
    "gender": "F",
    "email": "medottin@gmail.com",
    "phone": "Home: (246) 426-0129 / Work: (246) 432-6570",
    "address": "Hothersal Turning, St. Michael, BB11038, BB",
    "joinDate": "11/11/2013",
    "sponsor": "Charter Member",
    "role": "Active Member",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0062",
    "name": "Elizabeth C Franklin",
    "gender": "F",
    "email": "elizabeth_franklin@sagicor.com",
    "phone": "Home: (246) 436-2591",
    "address": "6 Wildey Gardens, Wildey, St. Michael, Bridgetown, BB",
    "joinDate": "05/26/2014",
    "sponsor": "Byer, Faye (78008-0048)",
    "role": "Active Member",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0017",
    "name": "Carmel Haynes",
    "gender": "F",
    "email": "carmelhaynes@yahoo.com",
    "phone": "Home: (246) 571-9246 / Work: (246) 537-2422 ext: 104 / Cell: (246) 822-0981",
    "address": "54 Clerpark, St. Michael, BB11000, BB",
    "joinDate": "05/27/2010",
    "sponsor": "Charter Member",
    "role": "Active Member & Charter Member",
    "pgi": "",
    "program": "Four-for-1, Free Member (expired)"
  },
  {
    "id": "78008-0142",
    "name": "Alicia Holder",
    "gender": "F",
    "email": "holder_alicia@hotmail.com",
    "phone": "Home: (246) 623-3728",
    "address": "Hillswick Village, St Joseph, BB",
    "joinDate": "06/09/2020",
    "sponsor": "Goodridge, Shaina (78008-0064)",
    "role": "Active Member",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0072",
    "name": "Shirley Hoyte",
    "gender": "F",
    "email": "shirleyhoyte@hotmail.com",
    "phone": "Home: (246) 426-7530 / Cell: (246) 266-8816",
    "address": "#3b Rock Avenue, Wildey, St. Michael, Bridgetown, 11106, BB",
    "joinDate": "08/31/2015",
    "sponsor": "Aquan, Margot (78008-0039)",
    "role": "Active Member",
    "pgi": "Level 5: 2020-06-08",
    "program": ""
  },
  {
    "id": "78008-0087",
    "name": "Stephanie C Layne",
    "gender": "F",
    "email": "stephanieclayne@gmail.com",
    "phone": "Work: (467) 828-5 / Cell: (239) 063-6",
    "address": "Free Hill, Black Rock, St. Michael, Bridgetown, BB",
    "joinDate": "05/20/2016",
    "sponsor": "Charter Member",
    "role": "Active Member & Charter Member",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0010",
    "name": "Charmaine London",
    "gender": "F",
    "email": "londoncharms@hotmail.com",
    "phone": "Home: (246) 424-2186 / Cell: (246) 232-0329",
    "address": "3rd Ave Grazettes, St. Michael, BB12033, BB",
    "joinDate": "05/27/2010",
    "sponsor": "Charter Member",
    "role": "Club Secretary & Charter Member",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0150",
    "name": "Richelle Lucas",
    "gender": "F",
    "email": "richelle.lucas16@gmail.com",
    "phone": "Work: (246) 233-7843 / Cell: (246) 256-0963",
    "address": "#45 Vespera Gardens, Lancaster, St. James, BB",
    "joinDate": "12/26/2023",
    "sponsor": "Sobers, Cameron (78008-0038)",
    "role": "Club President",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0152",
    "name": "Sharon Mohammed",
    "gender": "F",
    "email": "sharon@topaz-bb.com",
    "phone": "Cell: (246) 233-1557",
    "address": "Brathwaite Gap, Dayrells Road, Christ Church, BB14016, BB",
    "joinDate": "04/14/2025",
    "sponsor": "Workman, Edwin (78008-0021)",
    "role": "Club Treasurer",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0069",
    "name": "Aisha Norville",
    "gender": "F",
    "email": "aimichelle.nor@gmail.com",
    "phone": "Home: (246) 425-9505",
    "address": "#20 Padmore Heights, St. James, Bridgetown, BB",
    "joinDate": "08/31/2015",
    "sponsor": "Lucas, Richelle (78008-0042)",
    "role": "Active Member",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0068",
    "name": "Rozanne A Parris",
    "gender": "F",
    "email": "rozanne.parris@gmail.com",
    "phone": "Home: (246) 429-6218 / Work: (246) 228-5548",
    "address": "Mcclean'S Gap, Brittons Hill, St. Michael, Bridgetown, BB",
    "joinDate": "08/31/2015",
    "sponsor": "Dottin, Maureen (78008-0052)",
    "role": "Active Member",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0098",
    "name": "Hyacinth E Small",
    "gender": "F",
    "email": "windychile@hotmail.com",
    "phone": "Home: (246) 428-4766 / Cell: (246) 243-3120",
    "address": "Hanameel, 11 Windy Ridge, Christ Church, Bridgetown, BB17072, BB",
    "joinDate": "01/31/2017",
    "sponsor": "Workman, Edwin (78008-0021)",
    "role": "Active Member",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0038",
    "name": "Cameron P Sobers",
    "gender": "M",
    "email": "Cposobers@gmail.com",
    "phone": "Home: (246) 435-1703 / Work: (246) 262-6247 / Cell: (246) 234-2618",
    "address": "209 3rd Avenue, Rowans Park South, St. George, BB19036, BB",
    "joinDate": "06/14/2010",
    "sponsor": "Carter, Joy-Ann (78008-0001)",
    "role": "Club Board of Director",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0114",
    "name": "Garrylyn Swanston",
    "gender": "F",
    "email": "lynswanston@yahoo.com",
    "phone": "Home: (246) 427-6526 / Work: (246) 428-9598 / Cell: (246) 254-3588",
    "address": "#4 West Ridge, Brittons, Hill, St Michael, Bridgetown, AL, BB",
    "joinDate": "08/08/2017",
    "sponsor": "Aquan, Margot (78008-0039)",
    "role": "Active Member",
    "pgi": "",
    "program": "Recruit a Teacher, Free Member (expired)"
  },
  {
    "id": "78008-0120",
    "name": "Yolanda Thorpe",
    "gender": "F",
    "email": "whytee.ypt@gmail.com",
    "phone": "Home: (437) 417-9 / Work: (467) 224-8 / Cell: (239) 252-0",
    "address": "Cox Road, Christ Church, BB12093, BB",
    "joinDate": "07/05/2018",
    "sponsor": "Dottin, Maureen (78008-0052)",
    "role": "Active Member",
    "pgi": "",
    "program": ""
  },
  {
    "id": "78008-0108",
    "name": "Nicole Whiteman",
    "gender": "F",
    "email": "nicoleantoniawhiteman@hotmail.com",
    "phone": "Cell: (246) 822-1153",
    "address": "#13 Oxnards Heights, St. James, Bridgetown, BB",
    "joinDate": "07/17/2017",
    "sponsor": "Dottin, Maureen (78008-0052)",
    "role": "Active Member",
    "pgi": "",
    "program": "30 under 30 Member, Free Member (expired)"
  },
  {
    "id": "78008-0021",
    "name": "Edwin Workman",
    "gender": "M",
    "email": "edwin@jillandee.com",
    "phone": "Home: +1 (246) 548-2573 / Work: (246) 836-6185 / Cell: (246) 836-9004",
    "address": "2 Jackson Terrace, St. Michael, BB14014, BB",
    "joinDate": "05/27/2010",
    "sponsor": "Charter Member",
    "role": "System Administrator, Club Foundation Representative & Charter Member",
    "pgi": "",
    "program": ""
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
        access VARCHAR(50) DEFAULT 'member',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Guarantee the columns are added if they already exist
    await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS access VARCHAR(50) DEFAULT 'member';`;
    await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS password VARCHAR(255);`;

    // 2. Create dues_ledger table
    console.log("Creating table 'dues_ledger'...");
    await sql`
      CREATE TABLE IF NOT EXISTS dues_ledger (
        id SERIAL PRIMARY KEY,
        member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
        fiscal_year VARCHAR(50) DEFAULT '2025/2026 (Oct 1 - Sep 30)',
        dues_rate VARCHAR(50) DEFAULT '$250.00',
        amount_paid VARCHAR(50) DEFAULT '$250.00',
        balance_due VARCHAR(50) DEFAULT '$0.00',
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
        flyer_url TEXT,
        excerpt TEXT,
        content TEXT,
        impact VARCHAR(255),
        is_featured BOOLEAN DEFAULT FALSE,
        author VARCHAR(255),
        author_id VARCHAR(50),
        posted_at VARCHAR(50),
        children_served INTEGER DEFAULT 0,
        approved BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Alter table in case it already exists to guarantee it has the columns
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS children_served INTEGER DEFAULT 0;`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT TRUE;`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS flyer_url TEXT;`;

    // 4. Seed 21 Active Members & Dues Records
    console.log("Seeding 21 Active Members and Dues Ledgers into Neon DB...");
    await sql`DELETE FROM members;`;
    for (const m of all21Members) {
      const emailLower = m.email.toLowerCase().trim();
      let access = 'member';
      if (emailLower === 'richelle.lucas16@gmail.com' || emailLower === 'edwin@jillandee.com') {
        access = 'super admin';
      } else if (emailLower === 'sharon@topaz-bb.com') {
        access = 'finance';
      } else if (emailLower === 'londoncharms@hotmail.com') {
        access = 'admin';
      }

      let avatar = '/avatars/active_member_icon.jpg';
      if (emailLower === 'richelle.lucas16@gmail.com') avatar = '/avatars/president_placeholder.jpg';
      else if (emailLower === 'londoncharms@hotmail.com') avatar = '/avatars/secretary_placeholder.jpg';
      else if (emailLower === 'sharon@topaz-bb.com') avatar = '/avatars/treasurer_placeholder.jpg';
      else if (emailLower === 'edwin@jillandee.com') avatar = '/avatars/oirep_placeholder.jpg';
      else if (m.role && m.role.includes('Director')) avatar = '/avatars/director_placeholder.jpg';

      await sql`
        INSERT INTO members (id, name, gender, email, phone, address, join_date, sponsor, role, is_treasurer, is_president, avatar, access, password)
        VALUES (
          ${m.id}, ${m.name}, ${m.gender}, ${m.email}, ${m.phone}, ${m.address}, 
          ${m.joinDate}, ${m.sponsor}, ${m.role}, 
          ${access === 'super admin' || m.id === '78008-0152'}, ${access === 'super admin' || m.id === '78008-0150'},
          ${avatar},
          ${access},
          ${emailLower === 'edwin@jillandee.com' ? 'Eww!POCB2010' : null}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          role = EXCLUDED.role,
          avatar = EXCLUDED.avatar,
          access = EXCLUDED.access,
          password = EXCLUDED.password;
      `;

      // Seed dues ledgers separately
      let memberNotes = 'Annual dues paid in full.';
      if (emailLower === 'jcodrington67@hotmail.com') {
        memberNotes = "Member Type: Charter? No, College? No, Life? No, Diplomat? No, Prev JOI? No | PGI/PDP: n/a | Magazine: Hard-Copy | Ads: Don't send 3rd-party | Publish details: n/a";
      } else if (emailLower === 'carmel.haynes@gmail.com') {
        memberNotes = "Member Type: Charter? Yes, College? No, Life? No, Diplomat? No, Prev JOI? No | PGI/PDP: n/a | Programs: Four-for-1 | Magazine: Hard-Copy | Ads: Send 3rd-party | Publish details: n/a";
      }

      await sql`
        INSERT INTO dues_ledger (member_id, fiscal_year, dues_rate, amount_paid, balance_due, payment_method, dues_status, last_payment_date, notes, email_last_sent)
        VALUES (
          ${m.id}, '2025/2026 (Oct 1 - Sep 30)', '$250.00', '$250.00', '$0.00', 
          'Bank Transfer', 'Active Member (2025/2026)', '2025-10-01', ${memberNotes}, '2025-10-01'
        )
        ON CONFLICT DO NOTHING;
      `;
    }

    // 5. Seed actual Projects & Events
    console.log("Cleaning and seeding actual live Projects & Events...");
    await sql`TRUNCATE TABLE projects;`;
    for (const p of initialProjects) {
      await sql`
        INSERT INTO projects (id, title, category, date_str, image, flyer_url, excerpt, content, impact, is_featured, author, author_id, posted_at, children_served)
        VALUES (${p.id}, ${p.title}, ${p.category}, ${p.date}, ${p.image}, ${p.flyerUrl || null}, ${p.excerpt}, ${p.content}, ${p.impact}, ${p.isFeatured}, ${p.author}, ${p.authorId}, ${p.postedAt}, ${p.childrenServed || 0});
      `;
    }

    console.log("Database initialized & seeded successfully!");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

initializeDatabase();
