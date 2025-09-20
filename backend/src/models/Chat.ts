import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    modelUsed?: string;
    tokensUsed?: number;
    processingTime?: number;
  };
}

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: string;
  title?: string;
  messages: IMessage[];
  modelUsed: string;
  context?: {
    profileData?: any;
    ragContent?: string[];
    systemPrompt?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [10000, 'Message content too long']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    modelUsed: String,
    tokensUsed: Number,
    processingTime: Number
  }
}, { _id: false });

const ChatSchema = new Schema<IChat>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  messages: [MessageSchema],
  modelUsed: {
    type: String,
    required: true,
    enum: ['gemini-2b', 'huggingface', 'mock'],
    default: 'mock'
  },
  context: {
    profileData: Schema.Types.Mixed,
    ragContent: [String],
    systemPrompt: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ChatSchema.index({ userId: 1, createdAt: -1 });
ChatSchema.index({ sessionId: 1 });
ChatSchema.index({ userId: 1, isActive: 1 });

// Virtual for user details
ChatSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Auto-generate title from first user message
ChatSchema.pre('save', function(next) {
  if (!this.title && this.messages.length > 0) {
    const firstUserMessage = this.messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      this.title = firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '');
    }
  }
  next();
});

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
