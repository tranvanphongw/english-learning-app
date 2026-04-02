import mongoose, { Document, Schema } from 'mongoose';

// Interface này định nghĩa các thuộc tính của một document Story
export interface IStory extends Document {
  lesson?: mongoose.Schema.Types.ObjectId;
  topic?: mongoose.Schema.Types.ObjectId;
  content: string;
  selectedVocabIds: mongoose.Schema.Types.ObjectId[];
}

const StorySchema: Schema = new Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
    },
    content: {
      type: String,
      required: true,
    },
    selectedVocabIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vocab',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * ❗ Quan trọng: mỗi cặp (lesson, topic) chỉ có 1 story
 *  - Cho phép nhiều story cùng lesson, miễn topic khác nhau
 *  - Vẫn cho phép 1 story chỉ có lesson (topic = null) nếu bạn dùng createStoryForLesson
 */
StorySchema.index({ lesson: 1, topic: 1 }, { unique: true });

export default mongoose.model<IStory>('Story', StorySchema);
