import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  url: string;
  extractedText?: string;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>({
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
  url: { 
    type: String, 
    required: [true, 'URL is required']
  },
  extractedText: { 
    type: String,
    maxlength: [10000, 'Extracted text too long']
  },
  skills: [{ 
    type: String,
    trim: true,
    lowercase: true
  }]
}, { timestamps: true });

// Indexes for better query performance
ResumeSchema.index({ userId: 1, createdAt: -1 });
ResumeSchema.index({ skills: 1 });
ResumeSchema.index({ title: 'text' });

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
