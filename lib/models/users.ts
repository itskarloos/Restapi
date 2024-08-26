
import { Schema, model, models} from 'mongoose';




const userSchema = new Schema({
  Username: { type: String, unique:true, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
},
{timestamps:true}

);



const User = models.User || model('User', userSchema)

export default User
