import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/database';
import { User } from '../models/User';
import { Profile } from '../models/Profile';

dotenv.config();

const students = [
  { name: 'Aarav Sharma', email: 'aarav@example.in', passwordHash: 'Password123' },
  { name: 'Isha Patel', email: 'isha@example.in', passwordHash: 'Password123' },
  { name: 'Rahul Verma', email: 'rahul@example.in', passwordHash: 'Password123' }
];

const profiles = [
  { 
    education: { degree: 'Bachelor', field: 'Computer Science', institution: 'IIT Delhi', year: 2025, cgpa: 8.3 },
    interests: ['ai','web'], 
    skills: { technical: ['javascript','react','node'], soft: ['communication'], certifications: ['AWS Cloud Practitioner'] },
    experience: { internships: [], projects: [] },
    preferences: { careerGoals: ['software'], workLocation: 'hybrid' as const }
  },
  { 
    education: { degree: 'Master', field: 'Data Science', institution: 'IISc Bangalore', year: 2024, cgpa: 8.9 },
    interests: ['data','ml'], 
    skills: { technical: ['python','pandas','sql'], soft: ['teamwork'], certifications: [] },
    experience: { internships: [], projects: [] },
    preferences: { careerGoals: ['data scientist'], workLocation: 'remote' as const }
  },
  { 
    education: { degree: 'Bachelor', field: 'Electronics', institution: 'NIT Trichy', year: 2026, cgpa: 7.9 },
    interests: ['embedded','cloud'], 
    skills: { technical: ['c++','docker'], soft: ['problem-solving'], certifications: ['Cisco CCNA'] },
    experience: { internships: [], projects: [] },
    preferences: { careerGoals: ['embedded systems'], workLocation: 'onsite' as const }
  }
];

(async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Profile.deleteMany({});

    for (let i = 0; i < students.length; i++) {
      const u = new User(students[i]);
      await u.save();
      await Profile.create({
        userId: u._id,
        ...profiles[i]
      });
    }

    console.log('Seed complete');
  } catch (e) {
    console.error(e);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
})();
