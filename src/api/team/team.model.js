import mongoose, { Schema } from 'mongoose'

const teamSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  picture: {
    type: String
  }
}, {
  timestamps: true
})

teamSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      email: this.email,
      picture: this.picture,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

export default mongoose.model('Team', teamSchema)
