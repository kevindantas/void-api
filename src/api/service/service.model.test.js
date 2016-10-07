import test from 'ava'
import mockgoose from 'mockgoose'
import mongoose from '../../config/mongoose'
import { schema } from '.'

test.beforeEach(async (t) => {
  const mongo = new mongoose.Mongoose()
  await mockgoose(mongo)
  await mongo.connect('')
  const Service = mongo.model('Service', schema)
  const service = await Service.create({ nome: 'test', descricao: 'test', status: 'test' })

  t.context = { ...t.context, Service, service }
})

test.cb.after.always((t) => {
  mockgoose.reset(t.end)
})

test('view', (t) => {
  const { service } = t.context
  const view = service.view()
  t.true(typeof view === 'object')
  t.true(view.id === service.id)
  t.true(view.nome === service.nome)
  t.true(view.descricao === service.descricao)
  t.true(view.status === service.status)
  t.truthy(view.createdAt)
  t.truthy(view.updatedAt)
})

test('full view', (t) => {
  const { service } = t.context
  const view = service.view(true)
  t.true(typeof view === 'object')
  t.true(view.id === service.id)
  t.true(view.nome === service.nome)
  t.true(view.descricao === service.descricao)
  t.true(view.status === service.status)
  t.truthy(view.createdAt)
  t.truthy(view.updatedAt)
})
