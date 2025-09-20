import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  technologies: string[];
  repoUrl?: string;
  demoUrl?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  technologies: [{ 
    type: String,
    trim: true
  }],
  repoUrl: { 
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  demoUrl: { 
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  startDate: { type: Date },
  endDate: { type: Date }
}, { timestamps: true });

// Indexes for better query performance
ProjectSchema.index({ userId: 1, createdAt: -1 });
ProjectSchema.index({ technologies: 1 });
ProjectSchema.index({ title: 'text', description: 'text' });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
