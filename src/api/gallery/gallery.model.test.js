import test from 'ava'
import mockgoose from 'mockgoose'
import mongoose from '../../config/mongoose'
import { schema } from '.'
import { schema as userSchema } from '../user'

test.beforeEach(async (t) => {
  const mongo = new mongoose.Mongoose()
  await mockgoose(mongo)
  await mongo.connect('')
  const Gallery = mongo.model('Gallery', schema)
  const User = mongo.model('User', userSchema)
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const gallery = await Gallery.create({ user, title: 'test', description: 'test', picture: 'test', tags: 'test' })

  t.context = { ...t.context, Gallery, gallery, user }
})

test.cb.after.always((t) => {
  mockgoose.reset(t.end)
})

test('view', (t) => {
  const { gallery, user } = t.context
  const view = gallery.view()
  t.true(typeof view === 'object')
  t.true(view.id === gallery.id)
  t.true(typeof view.user === 'object')
  t.true(view.user.id === user.id)
  t.true(view.title === gallery.title)
  t.true(view.description === gallery.description)
  t.true(view.picture === gallery.picture)
  t.true(view.tags === gallery.tags)
  t.truthy(view.createdAt)
  t.truthy(view.updatedAt)
})

test('full view', (t) => {
  const { gallery, user } = t.context
  const view = gallery.view(true)
  t.true(typeof view === 'object')
  t.true(view.id === gallery.id)
  t.true(typeof view.user === 'object')
  t.true(view.user.id === user.id)
  t.true(view.title === gallery.title)
  t.true(view.description === gallery.description)
  t.true(view.picture === gallery.picture)
  t.true(view.tags === gallery.tags)
  t.truthy(view.createdAt)
  t.truthy(view.updatedAt)
})
