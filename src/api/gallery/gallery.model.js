import mongoose, { Schema } from 'mongoose'

const gallerySchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  picture: {
    type: String
  },
  tags: {
    type: String
  }
}, {
  timestamps: true
})

gallerySchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      title: this.title,
      description: this.description,
      picture: this.picture,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

export default mongoose.model('Gallery', gallerySchema)
