import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  education: {
    degree: string;
    field: string;
    institution: string;
    year: number;
    cgpa?: number;
  };
  interests: string[];
  skills: {
    technical: string[];
    soft: string[];
    certifications: string[];
  };
  experience: {
    internships: Array<{
      company: string;
      role: string;
      duration: string;
      description: string;
    }>;
    projects: Array<{
      name: string;
      description: string;
      technologies: string[];
      url?: string;
    }>;
  };
  resumeURL?: string;
  summary?: string;
  preferences: {
    careerGoals: string[];
    workLocation: 'remote' | 'onsite' | 'hybrid';
    salaryExpectation?: {
      min: number;
      max: number;
      currency: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  education: {
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      enum: ['Bachelor', 'Master', 'PhD', 'Diploma', 'Other']
    },
    field: {
      type: String,
      required: [true, 'Field of study is required']
    },
    institution: {
      type: String,
      required: [true, 'Institution name is required']
    },
    year: {
      type: Number,
      required: [true, 'Graduation year is required'],
      min: [1900, 'Invalid graduation year'],
      max: [2035, 'Invalid graduation year']
    },
    cgpa: {
      type: Number,
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10']
    }
  },
  interests: [{
    type: String,
    trim: true
  }],
  skills: {
    technical: [{
      type: String,
      trim: true
    }],
    soft: [{
      type: String,
      trim: true
    }],
    certifications: [{
      type: String,
      trim: true
    }]
  },
  experience: {
    internships: [{
      company: { type: String, required: true },
      role: { type: String, required: true },
      duration: { type: String, required: true },
      description: { type: String, required: true }
    }],
    projects: [{
      name: { type: String, required: true },
      description: { type: String, required: true },
      technologies: [{ type: String }],
      url: { type: String }
    }]
  },
  resumeURL: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  summary: {
    type: String,
    maxlength: [1000, 'Summary cannot exceed 1000 characters']
  },
  preferences: {
    careerGoals: [{
      type: String,
      trim: true
    }],
    workLocation: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'hybrid'
    },
    salaryExpectation: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: 'INR' }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ 'skills.technical': 1 });
ProfileSchema.index({ interests: 1 });
ProfileSchema.index({ createdAt: -1 });

// Virtual for user details
ProfileSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
