import mongoose, { Document, Schema } from 'mongoose';

export interface IPsychotestAnswer {
  questionId: number;
  answer: number; // 1-5 scale
  question: string;
}

export interface IPersonalityScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface ICareerRecommendation {
  title: string;
  description: string;
  matchPercentage: number;
  requiredSkills: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  growthProspects: string;
  reasoning: string;
}

export interface IPsychotestResult extends Document {
  userId: mongoose.Types.ObjectId;
  testVersion: string;
  answers: IPsychotestAnswer[];
  scores: IPersonalityScores;
  recommendedCareers: ICareerRecommendation[];
  skillGaps: string[];
  learningPath: {
    phase: string;
    duration: string;
    skills: string[];
    resources: string[];
  }[];
  generatedAt: Date;
  aiInsights: string;
  createdAt: Date;
  updatedAt: Date;
}

const PsychotestAnswerSchema = new Schema<IPsychotestAnswer>({
  questionId: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  answer: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  question: {
    type: String,
    required: true
  }
}, { _id: false });

const PersonalityScoresSchema = new Schema<IPersonalityScores>({
  openness: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  conscientiousness: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  extraversion: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  agreeableness: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  neuroticism: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, { _id: false });

const CareerRecommendationSchema = new Schema<ICareerRecommendation>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  matchPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  requiredSkills: [{
    type: String,
    required: true
  }],
  salaryRange: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' }
  },
  growthProspects: {
    type: String,
    required: true
  },
  reasoning: {
    type: String,
    required: true
  }
}, { _id: false });

const LearningPathSchema = new Schema({
  phase: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  resources: [{
    type: String,
    required: true
  }]
}, { _id: false });

const PsychotestResultSchema = new Schema<IPsychotestResult>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testVersion: {
    type: String,
    required: true,
    default: '1.0'
  },
  answers: [PsychotestAnswerSchema],
  scores: {
    type: PersonalityScoresSchema,
    required: true
  },
  recommendedCareers: [CareerRecommendationSchema],
  skillGaps: [{
    type: String
  }],
  learningPath: [LearningPathSchema],
  generatedAt: {
    type: Date,
    default: Date.now
  },
  aiInsights: {
    type: String,
    maxlength: [2000, 'AI insights cannot exceed 2000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
PsychotestResultSchema.index({ userId: 1, generatedAt: -1 });
PsychotestResultSchema.index({ userId: 1, testVersion: 1 });

// Virtual for user details
PsychotestResultSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

export const PsychotestResult = mongoose.model<IPsychotestResult>('PsychotestResult', PsychotestResultSchema);
