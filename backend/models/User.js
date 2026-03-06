import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Student', 'Supervisor', 'Admin'],
      required: true,
    },
    // For students: their approved supervisor
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // For supervisors: their assigned students
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
