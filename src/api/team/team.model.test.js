import test from 'ava'
import mockgoose from 'mockgoose'
import mongoose from '../../config/mongoose'
import { schema } from '.'

test.beforeEach(async (t) => {
  const mongo = new mongoose.Mongoose()
  await mockgoose(mongo)
  await mongo.connect('')
  const Team = mongo.model('Team', schema)
  const team = await Team.create({ name: 'test', email: 'test', picture: 'test' })

  t.context = { ...t.context, Team, team }
})

test.cb.after.always((t) => {
  mockgoose.reset(t.end)
})

test('view', (t) => {
  const { team } = t.context
  const view = team.view()
  t.true(typeof view === 'object')
  t.true(view.id === team.id)
  t.true(view.name === team.name)
  t.true(view.email === team.email)
  t.true(view.picture === team.picture)
  t.truthy(view.createdAt)
  t.truthy(view.updatedAt)
})

test('full view', (t) => {
  const { team } = t.context
  const view = team.view(true)
  t.true(typeof view === 'object')
  t.true(view.id === team.id)
  t.true(view.name === team.name)
  t.true(view.email === team.email)
  t.true(view.picture === team.picture)
  t.truthy(view.createdAt)
  t.truthy(view.updatedAt)
})
