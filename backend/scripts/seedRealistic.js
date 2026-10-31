// Realistic, additive seed for MIT ADT University (Loni Kalbhor, Pune).
// Usage: MONGODB_URI=... node scripts/seedRealistic.js
// Refuses to run if the target DB already has data (no deletes). Override with --force.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/User');
const Event = require('../models/Event');
const News = require('../models/News');
const Facility = require('../models/Facility');
const LostFoundItem = require('../models/LostFoundItem');
const Complaint = require('../models/Complaint');
const ClubRecruitment = require('../models/ClubRecruitment');
const Chat = require('../models/Chat');

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const daysFrom = (d) => new Date(Date.now() + d * 86400000);
const rnd = (n) => crypto.randomBytes(n).toString('hex');

const FIRST = ['Aarav','Vihaan','Aditya','Arjun','Rohan','Kunal','Siddharth','Rahul','Ishaan','Aryan','Karan','Nikhil','Pranav','Yash','Harsh','Tushar','Abhishek','Saurabh','Ankit','Varun','Dhruv','Manav','Mihir','Omkar','Sahil','Akash','Vedant','Shreyas','Atharva','Parth','Ananya','Diya','Saanvi','Aadhya','Ira','Myra','Kiara','Riya','Prisha','Sneha','Pooja','Neha','Aditi','Kavya','Shruti','Tanvi','Isha','Megha','Pallavi','Nisha','Rutuja','Sakshi','Gauri','Mansi','Anushka','Trisha','Aishwarya','Devika','Ritika','Sanika','Swara','Mrunal','Gayatri','Tejas','Ajinkya','Prathamesh','Sarthak','Rushikesh','Amol','Chetan','Girish','Mayur'];
const LAST = ['Sharma','Verma','Patil','Deshmukh','Kulkarni','Joshi','Kale','Pawar','Jadhav','Shinde','Gaikwad','More','Bhosale','Chavan','Ghadge','Kadam','Mane','Salunkhe','Thorat','Wagh','Gupta','Agarwal','Mehta','Shah','Jain','Iyer','Nair','Menon','Reddy','Rao','Pillai','Singh','Kapoor','Malhotra','Bansal','Saxena','Mishra','Pandey','Tiwari','Yadav','Khan','Qureshi','Fernandes','D\'Souza'];
const MAJORS = ['Computer Science & Engineering','Electronics & Telecommunication','Mechanical Engineering','Civil Engineering','Information Technology','Artificial Intelligence & Data Science','Electrical Engineering','Biotechnology','Business Administration (MBA)','Design (B.Des)','Law (BA LLB)','Pharmacy (B.Pharm)','Mass Communication','Psychology'];
const YEARS = ['1st Year','2nd Year','3rd Year','4th Year','MBA 1st Year','MBA 2nd Year'];
const GENDERS = ['Male','Female','Prefer not to say'];

const FACILITIES = [
  { name: 'Central Library', type: 'Academic', icon: 'book', location: 'Admin Block, Ground Floor', description: 'Open 8:00 AM to 10:00 PM on weekdays and 9:00 AM to 6:00 PM on Saturdays. Digital journals, e-books via DELNET and a quiet reading hall on the top floor.' },
  { name: 'Main Cafeteria', type: 'Food', icon: 'utensils', location: 'Near Boys Hostel Gate', description: 'Veg and non-veg thali, South Indian breakfast and cold beverages. Cash and UPI accepted. Lunch rush 12:30 to 2:00 PM.' },
  { name: 'Computer Lab (CSE)', type: 'Academic', icon: 'computer', location: 'Engineering Block, 3rd Floor', description: 'Lab 1 to 4 with lab machines, GPU workstation for AI/ML projects. Book through the department coordinator for after-hours access.' },
  { name: 'Boys Hostel (Block A)', type: 'Accommodation', icon: 'home', location: 'Behind Sports Complex', description: 'Double and triple sharing rooms with Wi-Fi, 24x7 security and warden on duty. Mess timings: breakfast 7:30 AM, dinner 8:30 PM.' },
  { name: 'Girls Hostel (Block B)', type: 'Accommodation', icon: 'home', location: 'Opposite Central Library', description: 'Attached bathrooms, biometric entry, CCTV on all floors. Visitors allowed 10:00 AM to 6:00 PM with prior entry in the register.' },
  { name: 'Sports Complex', type: 'Service', icon: 'activity', location: 'South Campus', description: 'Cricket ground, indoor badminton and table tennis courts, gym with cardio and free weights. Carry college ID for entry.' },
  { name: 'Health Centre', type: 'Service', icon: 'heart', location: 'Admin Block, Ground Floor', description: 'In-house doctor available 9:00 AM to 5:00 PM. Basic medicines, first aid and referral to Pune hospitals. Ambulance on call for emergencies.' },
  { name: 'Auditorium (Dr. Vishwanath Karad Hall)', type: 'Service', icon: 'mic', location: 'Central Quadrangle', description: 'Seats 800. Used for guest lectures, fests and convocations. Bookings through the Dean of Student Welfare office.' },
];

const CLUBS = [
  ['MIT ADT Coding Club','Weekly DSA sessions, hackathon prep and open-source sprints. Freshers welcome, no prior experience needed.','https://forms.gle/mitadt-coding'],
  ['Robotics & Automation Society','Build line-following bots, drone workshops and the annual inter-college robo-wars.','https://forms.gle/mitadt-robotics'],
  ['Literary Circle','Poetry slams, debates and the campus magazine "Shabd". Writers and editors needed.','https://forms.gle/mitadt-literary'],
  ['Dance Crew "Rhythm"','Western, contemporary and classical fusion. Auditions open for the Navratri and cultural fest.','https://forms.gle/mitadt-dance'],
  ['Photography Club','Monthly photo walks around Loni Kalbhor and studio lighting workshops. Bring your own camera or phone.','https://forms.gle/mitadt-photo'],
  ['NSS Unit','Blood donation camps, village outreach and tree plantation drives. Mandatory service hours applicable.','https://forms.gle/mitadt-nss'],
];

const NEWS = [
  ['Mid-semester exam timetable released','The mid-semester examination timetable for all UG programmes is now on the student portal. Hall tickets will be issued from next Monday.','Academics'],
  ['Campus Fest "Utsav 2026" registrations open','Register for dance, music, drama and fashion events on the Student Activity portal before the deadline. Team events allow up to 6 members.','Events'],
  ['Library extends weekend hours during exams','The Central Library will remain open till 11:00 PM on weekdays during the examination period.','Facilities'],
  ['Placement drive: TCS and Infosys on campus','Eligible final-year CSE, IT and AI&DS students must register via the placement cell by Friday 5:00 PM.','Placements'],
  ['Hostel mess menu revised','The mess committee has added millet-based breakfast options on Tuesdays and Thursdays from this week.','Hostel'],
  ['Water conservation drive in Block B','Please report leaking taps to the maintenance desk. Hostel water supply will be checked every Wednesday.','Campus'],
  ['Guest lecture on Generative AI','Dr. Meera Iyer from IIT Bombay will speak on responsible AI in the Auditorium at 3:00 PM on Thursday. All students welcome.','Academics'],
  ['Bus route 4 rescheduled','The Hadapsar to campus shuttle will now depart 15 minutes earlier from 8:05 AM. Updated timings are on the notice board.','Transport'],
  ['Annual sports meet results','Engineering Block secured the overall championship with 142 points. Congratulations to all participants.','Sports'],
];

const EVENTS = [
  ['Utsav 2026 - Opening Ceremony','Inaugural night of the annual cultural fest with performances by student clubs.','Auditorium (Dr. Vishwanath Karad Hall)','Upcoming',10],
  ['TCS CodeVita Qualifier','Online coding qualifier for final-year and pre-final students. Bring your laptop to the CSE lab.','Computer Lab (CSE)','Upcoming',14],
  ['Inter-Department Cricket Tournament','Knockout league across all engineering departments. Team registration closes Friday.','Sports Complex','Upcoming',20],
  ['Guest Lecture: Responsible AI','Dr. Meera Iyer (IIT Bombay) on bias, privacy and governance in AI systems.','Auditorium (Dr. Vishwanath Karad Hall)','Upcoming',7],
  ['Blood Donation Camp (NSS)','Organised with Sahyadri Blood Bank. Carry a valid ID and eat a light meal beforehand.','Central Quadrangle','Upcoming',25],
  ['Hackathon: Smart Campus 2026','24-hour hackathon on campus IoT and energy saving. Teams of 3 to 4.','Engineering Block, 3rd Floor','Upcoming',40],
  ['Freshers Welcome Night','Welcome party for the 1st year batch with DJ, games and food stalls.','Central Quadrangle','Completed',-12],
  ['Industry Visit: Tata Motors Pune','Bus leaves campus at 7:30 AM. Mandatory dress code: formal with ID card.','Main Gate','Completed',-20],
  ['Robotics Workshop: Line Follower Bots','Hands-on session building and tuning line-following robots with Arduino.','Mechanical Workshop','Completed',-5],
  ['Photography Walk: Loni Kalbhor Lakes','Early-morning shoot around the lakes. Meet at the main gate at 6:00 AM.','Main Gate','Cancelled',-2],
];

const LOCATIONS = ['Central Library','Main Cafeteria','Boys Hostel (Block A)','Girls Hostel (Block B)','Engineering Block, 2nd Floor','Engineering Block, 3rd Floor','Sports Complex','Admin Block','Main Gate','Central Quadrangle','Mechanical Workshop','Auditorium'];
const LOST_ITEMS = [
  ['Black Dell laptop bag','Contains a Dell Inspiron laptop charger and a blue notebook.','lost'],
  ['Student ID card','Lost my ID card near the canteen. Name on the card is clearly visible.','lost'],
  ['Scientific calculator (Casio fx-991)','Left it in Room 304 after the Engineering Maths exam.','lost'],
  ['Steel water bottle (maroon)','Has a sticker of a rocket on the side.','lost'],
  ['Wired earphones (white)','Found near the badminton court.','found'],
  ['Prescription spectacles in a black case','Found on the bench outside the library.','found'],
  ['Umbrella (navy blue)','Left in the auditorium lobby after the guest lecture.','found'],
  ['Engineering Drawing kit','Compass box with a set square, found in Lab 2.','found'],
];
const COMPLAINT_CASES = [
  ['Water not coming in hostel bathroom','Block B 2nd floor bathroom has had no water since Tuesday morning. Maintenance was informed twice.','Facilities Management','Facilities','High'],
  ['Wi-Fi drops every evening','Hostel Wi-Fi disconnects between 7 and 10 PM daily, making online classes impossible.','IT Services','IT','High'],
  ['Mess food quality','Dal was served cold and rice was undercooked at dinner on Friday.','Student Services','Other','Medium'],
  ['Library books not returned by others','Several reserved reference books are overdue but not returned. Requesting a reminder system.','Academic Affairs','Academic','Low'],
  ['Projector not working in Room 210','The projector has no signal and the HDMI port looks damaged. Classes are being shifted.','IT Services','IT','Medium'],
  ['Late bus to campus','Shuttle reached the stop 25 minutes late for three days this week.','Administration','Administrative','Medium'],
  ['Unsafe parking area near Gate 2','Lights are out after 8 PM and the area feels unsafe for two-wheeler parking.','Security','Security','High'],
  ['Fee receipt not generated online','Payment went through but the receipt is not showing on the portal.','Administration','Administrative','Urgent'],
];

const CHAT_LINES = [
  'Anyone have the notes for Data Structures unit 3?','Yes, sending them on the group drive now','Thanks bro! Is the mid-sem timetable out?','Yes, check the portal under Examinations',
  'Who is coming to the Utsav auditions tomorrow?','Me! Shall we meet at the Auditorium at 4?','Is the canteen open on Sunday?','Only breakfast, lunch closes at 2 PM',
  'Lost my calculator again 😅','Check the lost and found section, someone posted one',
  'Hackathon team still needs a frontend dev','I can do React, DM me','Bus 4 is late again','Yeah the 8:05 change is confusing, I missed it twice',
  'Study group for Maths tonight at library?','Count me in, 7 PM works','Bhai did you submit the lab report?','Submitting at 11, deadline is 11:59',
];

async function main() {
  const force = process.argv.includes('--force');
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  console.log('Target database:', db.databaseName);

  const existing = {};
  for (const c of await db.listCollections().toArray()) {
    existing[c.name] = await db.collection(c.name).countDocuments();
  }
  const total = Object.values(existing).reduce((a, b) => a + b, 0);
  if (total > 0 && !force) {
    console.error('Refusing to seed: database is not empty.', existing, 'Re-run with --force to add anyway (nothing is deleted).');
    process.exit(1);
  }

  // ---- Users: 500 students. Passwords are random and printed nowhere. ----
  const seen = new Set();
  const users = [];
  const testPassword = 'Test@12345';
  users.push({ email: 'testuser@mitadt.edu', name: 'Test User', major: MAJORS[0], yearOfStudy: '2nd Year', gender: 'Prefer not to say', program: 'B.Tech', password: testPassword, phone: '9800000000' });
  while (users.length < 500) {
    const f = pick(FIRST), l = pick(LAST);
    const base = `${f}.${l}`.toLowerCase().replace(/[^a-z.]/g, '');
    let email = `${base}@mitadt.edu`;
    let n = 1;
    while (seen.has(email)) email = `${base}${n++}@mitadt.edu`;
    seen.add(email);
    const major = pick(MAJORS);
    users.push({
      email, name: `${f} ${l}`, major, yearOfStudy: pick(YEARS), gender: pick(GENDERS),
      program: major.includes('MBA') ? 'MBA' : major.includes('Law') ? 'Integrated Law' : 'B.Tech',
      dateOfBirth: new Date(Date.now() - randInt(18, 24) * 365 * 86400000 - randInt(0, 364) * 86400000),
      phone: `9${randInt(100000000, 999999999)}`,
      password: `${rnd(6)}Mt#${randInt(10, 99)}`,
    });
  }
  const hashed = [];
  for (const u of users) {
    const { password, ...rest } = u;
    hashed.push({ ...rest, password: await bcrypt.hash(password, 10), createdAt: new Date(Date.now() - randInt(1, 400) * 86400000) });
  }
  const insertedUsers = await User.insertMany(hashed, { ordered: true });
  const ids = insertedUsers.map((u) => u._id);
  const pickUser = () => pick(ids);
  console.log(`Users: ${insertedUsers.length}`);

  // Admin for /admin/users, use the seeded test account's id as creator where needed.
  await Facility.insertMany(FACILITIES.map((f) => ({ ...f, images: [] })));
  console.log(`Facilities: ${FACILITIES.length}`);

  await Event.insertMany(EVENTS.map(([title, description, location, status, offset]) => ({
    title, description, location, status,
    date: daysFrom(offset),
    operatingHours: '10:00 AM to 5:00 PM',
    registerUrl: 'https://forms.gle/mitadt-events',
    contactInfo: { name: 'Student Activity Cell', email: 'sac@mitadt.edu', phone: '02068887000' },
    mapLocation: { building: location.split(',')[0], floor: '', room: '', coordinates: { lat: 18.5, lng: 73.9 } },
  })));
  console.log(`Events: ${EVENTS.length}`);

  await News.insertMany(NEWS.map(([title, description, category], i) => ({
    title, description, category, date: daysFrom(-i * 2), images: [],
  })));
  console.log(`News: ${NEWS.length}`);

  await ClubRecruitment.insertMany(CLUBS.map(([clubName, description, formUrl], i) => ({
    title: `${clubName} - Recruitments`, clubName, description, formUrl,
    startDate: daysFrom(-3), endDate: daysFrom(15 + i),
    contactInfo: { name: 'Club Coordinator', email: `${clubName.split(' ')[0].toLowerCase()}@mitadt.edu`, phone: '02068887000' },
    status: 'Open',
  })));
  console.log(`Club recruitments: ${CLUBS.length}`);

  const lf = [];
  for (let i = 0; i < 30; i++) {
    const [title, description, type] = pick(LOST_ITEMS);
    lf.push({
      user: pickUser(), type, title, description, location: pick(LOCATIONS),
      date: daysFrom(-randInt(0, 20)), images: [], contact: `${randInt(9000000000, 9999999999)}`,
      resolved: Math.random() < 0.3,
    });
  }
  await LostFoundItem.insertMany(lf);
  console.log(`Lost & found: ${lf.length}`);

  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const complaints = [];
  for (let i = 0; i < 40; i++) {
    const [title, description, department, category, priority] = pick(COMPLAINT_CASES);
    const status = pick(statuses);
    const creator = pickUser();
    complaints.push({
      user: creator, title, description, category, priority, department,
      status,
      statusHistory: [{ status, comment: 'Logged and under review.', updatedBy: creator, timestamp: new Date() }],
      images: [],
      upvotes: [],
      createdAt: daysFrom(-randInt(1, 60)),
    });
  }
  await Complaint.insertMany(complaints);
  console.log(`Complaints: ${complaints.length}`);

  const chats = [];
  const base = Date.now() - 3 * 86400000;
  for (let i = 0; i < 200; i++) {
    chats.push({ sender: pickUser(), message: pick(CHAT_LINES), timestamp: new Date(base + i * 25 * 60000) });
  }
  await Chat.insertMany(chats);
  console.log(`Chat messages: ${chats.length}`);

  console.log('Done. Test login: testuser@mitadt.edu / Test@12345');
  console.log('Student passwords are random and not stored anywhere; use the forgot-password flow to reset a student account.');
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
