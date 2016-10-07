import test from 'ava'
import Promise from 'bluebird'
import request from 'supertest-as-promised'
import mockgoose from 'mockgoose'
import { signSync } from '../../services/jwt'
import express from '../../config/express'
import mongoose from '../../config/mongoose'
import { User } from '../user'
import routes, { Service } from '.'

const app = () => express(routes)

test.before(async (t) => {
  await mockgoose(mongoose)
  await mongoose.connect('')
})

test.beforeEach(async (t) => {
  const [ user, anotherUser, admin ] = await User.create([
    { email: 'a@a.com', password: '123456' },
    { email: 'b@b.com', password: '123456' },
    { email: 'c@c.com', password: '123456', role: 'admin' }
  ])
  const [ userSession, anotherSession, adminSession ] = [
    signSync(user.id), signSync(anotherUser.id), signSync(admin.id)
  ]
  const service = await Service.create({})
  t.context = { ...t.context, userSession, anotherSession, adminSession, service }
})

test.afterEach.always(async (t) => {
  await Promise.all([User.remove(), Service.remove()])
})

test.serial('POST /service 201 (admin)', async (t) => {
  const { adminSession } = t.context
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: adminSession, nome: 'test', descricao: 'test', status: 'test' })
  t.true(status === 201)
  t.true(typeof body === 'object')
  t.true(body.nome === 'test')
  t.true(body.descricao === 'test')
  t.true(body.status === 'test')
})

test.serial('POST /service 401 (user)', async (t) => {
  const { userSession } = t.context
  const { status } = await request(app())
    .post('/')
    .send({ access_token: userSession })
  t.true(status === 401)
})

test.serial('POST /service 401', async (t) => {
  const { status } = await request(app())
    .post('/')
  t.true(status === 401)
})

test.serial('GET /service 200', async (t) => {
  const { status, body } = await request(app())
    .get('/')
  t.true(status === 200)
  t.true(Array.isArray(body))
})

test.serial('GET /service/:id 200', async (t) => {
  const { service } = t.context
  const { status, body } = await request(app())
    .get(`/${service.id}`)
  t.true(status === 200)
  t.true(typeof body === 'object')
  t.true(body.id === service.id)
})

test.serial('GET /service/:id 404', async (t) => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  t.true(status === 404)
})

test.serial('PUT /service/:id 200 (user)', async (t) => {
  const { userSession, service } = t.context
  const { status, body } = await request(app())
    .put(`/${service.id}`)
    .send({ access_token: userSession, nome: 'test', descricao: 'test', status: 'test' })
  t.true(status === 200)
  t.true(typeof body === 'object')
  t.true(body.id === service.id)
  t.true(body.nome === 'test')
  t.true(body.descricao === 'test')
  t.true(body.status === 'test')
})

test.serial('PUT /service/:id 401', async (t) => {
  const { service } = t.context
  const { status } = await request(app())
    .put(`/${service.id}`)
  t.true(status === 401)
})

test.serial('PUT /service/:id 404 (user)', async (t) => {
  const { userSession } = t.context
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: userSession, nome: 'test', descricao: 'test', status: 'test' })
  t.true(status === 404)
})

test.serial('DELETE /service/:id 204 (admin)', async (t) => {
  const { adminSession, service } = t.context
  const { status } = await request(app())
    .delete(`/${service.id}`)
    .query({ access_token: adminSession })
  t.true(status === 204)
})

test.serial('DELETE /service/:id 401 (user)', async (t) => {
  const { userSession, service } = t.context
  const { status } = await request(app())
    .delete(`/${service.id}`)
    .query({ access_token: userSession })
  t.true(status === 401)
})

test.serial('DELETE /service/:id 401', async (t) => {
  const { service } = t.context
  const { status } = await request(app())
    .delete(`/${service.id}`)
  t.true(status === 401)
})

test.serial('DELETE /service/:id 404 (admin)', async (t) => {
  const { adminSession } = t.context
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: adminSession })
  t.true(status === 404)
})
