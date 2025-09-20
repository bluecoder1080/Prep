import mongoose, { Document, Schema } from 'mongoose';

export interface ITechUpdate extends Document {
  source: 'github' | 'hackernews' | 'rss' | 'jobs_api' | 'manual';
  title: string;
  url: string;
  description?: string;
  content?: string;
  tags: string[];
  skills: string[];
  summary: string;
  publishedAt: Date;
  fetchedAt: Date;
  embeddingVector?: number[];
  relevanceScore?: number;
  category: 'technology' | 'career' | 'skills' | 'industry' | 'education';
  metadata: {
    author?: string;
    upvotes?: number;
    comments?: number;
    language?: string;
    stars?: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TechUpdateSchema = new Schema<ITechUpdate>({
  source: {
    type: String,
    enum: ['github', 'hackernews', 'rss', 'jobs_api', 'manual'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [300, 'Title cannot exceed 300 characters'],
    index: 'text'
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    unique: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  content: {
    type: String,
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  skills: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    maxlength: [500, 'Summary cannot exceed 500 characters']
  },
  publishedAt: {
    type: Date,
    required: true
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  },
  embeddingVector: [{
    type: Number
  }],
  relevanceScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  category: {
    type: String,
    enum: ['technology', 'career', 'skills', 'industry', 'education'],
    required: true
  },
  metadata: {
    author: String,
    upvotes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    language: String,
    stars: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
TechUpdateSchema.index({ source: 1, publishedAt: -1 });
TechUpdateSchema.index({ tags: 1 });
TechUpdateSchema.index({ skills: 1 });
TechUpdateSchema.index({ category: 1, publishedAt: -1 });
TechUpdateSchema.index({ fetchedAt: -1 });
TechUpdateSchema.index({ relevanceScore: -1 });
TechUpdateSchema.index({ title: 'text', description: 'text', summary: 'text' });

// Compound index for efficient queries
TechUpdateSchema.index({ 
  isActive: 1, 
  category: 1, 
  publishedAt: -1 
});

export const TechUpdate = mongoose.model<ITechUpdate>('TechUpdate', TechUpdateSchema);
