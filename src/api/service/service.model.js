import mongoose, { Schema } from 'mongoose'

const serviceSchema = new Schema({
  nome: {
    type: String
  },
  descricao: {
    type: String
  },
  status: {
    type: String
  }
}, {
  timestamps: true
})

serviceSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      nome: this.nome,
      descricao: this.descricao,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

export default mongoose.model('Service', serviceSchema)
