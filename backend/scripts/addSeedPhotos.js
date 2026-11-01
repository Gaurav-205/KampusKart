// Fills empty image fields on records created by seedRealistic.js, with stock Unsplash photos.
// Never overwrites an existing image. Dry run by default; pass --apply to write.
// Usage: MONGODB_URI=... node scripts/addSeedPhotos.js [--apply]
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Event = require('../models/Event');
const News = require('../models/News');
const Facility = require('../models/Facility');
const ClubRecruitment = require('../models/ClubRecruitment');

const PHOTOS = {
  hackathon: '1522071820081-009f0129c71c',
  volunteers: '1517486808906-6ca8b3f04846',
  field: '1574629810360-7efbbe195018',
  code: '1555949963-aa79dcee981c',
  festival: '1514525253161-7a46d19cd819',
  stage: '1505373877841-8d25f7d46678',
  friends: '1529156069898-49953e39b3ac',
  workshop: '1558618666-fcd25c85cd64',
  performer: '1493225457124-a3eb161ffa5f',
  office: '1521737604893-d14cc237f11d',
  classroom: '1580582932707-520aed937b7b',
  libraryDark: '1481627834876-b7833e8f5570',
  meeting: '1552664730-d307ca884978',
  restaurant: '1517248135467-4c7edcad34c4',
  bottle: '1602143407151-7111542de6e8',
  lecture: '1524178232363-1fb2b075b655',
  campus: '1607237138185-eedd9c632b0b',
  library: '1498243691581-b145c3f54a5a',
  laptop: '1516321318423-f06f85e504b3',
  room: '1522771739844-6a9f6d5f14af',
  gym: '1534438327276-14e5300c3a48',
  labGlass: '1532094349884-543bc11b234d',
  seats: '1519452635265-7b1fbfd1e4e0',
  book: '1543002588-bfa74002ed7e'
};

const TARGETS = [
  {
    model: Event,
    key: 'title',
    field: 'image',
    photos: {
      'Hackathon: Smart Campus 2026': 'hackathon',
      'Blood Donation Camp (NSS)': 'volunteers',
      'Inter-Department Cricket Tournament': 'field',
      'TCS CodeVita Qualifier': 'code',
      'Utsav 2026 - Opening Ceremony': 'festival',
      'Guest Lecture: Responsible AI': 'stage',
      'Photography Walk: Loni Kalbhor Lakes': 'friends',
      'Robotics Workshop: Line Follower Bots': 'workshop',
      'Freshers Welcome Night': 'performer',
      'Industry Visit: Tata Motors Pune': 'office'
    }
  },
  {
    model: News,
    key: 'title',
    field: 'images',
    photos: {
      'Mid-semester exam timetable released': 'classroom',
      'Campus Fest "Utsav 2026" registrations open': 'festival',
      'Library extends weekend hours during exams': 'libraryDark',
      'Placement drive: TCS and Infosys on campus': 'meeting',
      'Hostel mess menu revised': 'restaurant',
      'Water conservation drive in Block B': 'bottle',
      'Guest lecture on Generative AI': 'lecture',
      'Bus route 4 rescheduled': 'campus',
      'Annual sports meet results': 'field'
    }
  },
  {
    model: Facility,
    key: 'name',
    field: 'images',
    photos: {
      'Central Library': 'library',
      'Main Cafeteria': 'restaurant',
      'Computer Lab (CSE)': 'laptop',
      'Boys Hostel (Block A)': 'room',
      'Girls Hostel (Block B)': 'room',
      'Sports Complex': 'gym',
      'Health Centre': 'labGlass',
      'Auditorium (Dr. Vishwanath Karad Hall)': 'seats'
    }
  },
  {
    model: ClubRecruitment,
    key: 'title',
    field: 'image',
    photos: {
      'MIT ADT Coding Club - Recruitments': 'code',
      'Robotics & Automation Society - Recruitments': 'workshop',
      'Literary Circle - Recruitments': 'book',
      'Dance Crew "Rhythm" - Recruitments': 'festival',
      'Photography Club - Recruitments': 'friends',
      'NSS Unit - Recruitments': 'volunteers'
    }
  }
];

const hasImage = (doc, field) => (field === 'images' ? doc.images?.length > 0 : Boolean(doc.image?.url));

// public_id marks the photo as stock; a Cloudinary destroy on it is a harmless "not found".
const stockImage = (name) => ({
  public_id: `stock/${name}`,
  url: `https://images.unsplash.com/photo-${PHOTOS[name]}?w=800&h=600&fit=crop`
});

async function main() {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`${apply ? 'APPLY' : 'DRY RUN'} on ${mongoose.connection.host}/${mongoose.connection.name}`);

  let filled = 0;
  for (const { model, key, field, photos } of TARGETS) {
    const counts = { filled: 0, kept: 0, missing: 0 };
    for (const [label, name] of Object.entries(photos)) {
      const docs = await model.find({ [key]: label }).select(`${key} ${field}`).lean();
      if (docs.length === 0) counts.missing += 1;
      for (const doc of docs) {
        if (hasImage(doc, field)) {
          counts.kept += 1;
          continue;
        }
        const image = stockImage(name);
        if (apply) {
          await model.collection.updateOne(
            { _id: doc._id },
            { $set: { [field]: field === 'images' ? [image] : image } }
          );
        }
        counts.filled += 1;
      }
    }
    filled += counts.filled;
    console.log(`${model.modelName}: ${apply ? 'filled' : 'would fill'} ${counts.filled}, kept ${counts.kept}, no match ${counts.missing}`);
  }
  console.log(`Total: ${filled}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
