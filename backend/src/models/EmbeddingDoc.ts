import mongoose, { Document, Schema } from 'mongoose';

export interface IEmbeddingDoc extends Document {
  docId: string; // external reference id
  source: 'job' | 'report' | 'blog' | 'manual';
  title: string;
  text: string;
  tags: string[];
  skills: string[];
  embedding: number[]; // vector
  createdAt: Date;
  updatedAt: Date;
}

const EmbeddingDocSchema = new Schema<IEmbeddingDoc>({
  docId: { 
    type: String, 
    required: [true, 'Document ID is required'],
    index: true,
    trim: true
  },
  source: { 
    type: String, 
    enum: ['job', 'report', 'blog', 'manual'], 
    default: 'manual',
    required: true
  },
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters']
  },
  text: { 
    type: String, 
    required: [true, 'Text content is required'],
    maxlength: [10000, 'Text content too long']
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
  embedding: [{ 
    type: Number, 
    required: true 
  }]
}, { timestamps: true });

// Indexes for better query performance
EmbeddingDocSchema.index({ docId: 1 });
EmbeddingDocSchema.index({ source: 1, createdAt: -1 });
EmbeddingDocSchema.index({ tags: 1 });
EmbeddingDocSchema.index({ skills: 1 });
EmbeddingDocSchema.index({ createdAt: -1 });
EmbeddingDocSchema.index({ title: 'text', text: 'text' });

export const EmbeddingDoc = mongoose.model<IEmbeddingDoc>('EmbeddingDoc', EmbeddingDocSchema);
