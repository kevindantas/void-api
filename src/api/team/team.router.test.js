import test from 'ava'
import Promise from 'bluebird'
import request from 'supertest-as-promised'
import mockgoose from 'mockgoose'
import { signSync } from '../../services/jwt'
import express from '../../config/express'
import mongoose from '../../config/mongoose'
import { User } from '../user'
import routes, { Team } from '.'

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
  const team = await Team.create({})
  t.context = { ...t.context, userSession, anotherSession, adminSession, team }
})

test.afterEach.always(async (t) => {
  await Promise.all([User.remove(), Team.remove()])
})

test.serial('POST /team 201 (admin)', async (t) => {
  const { adminSession } = t.context
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: adminSession, name: 'test', email: 'test', picture: 'test' })
  t.true(status === 201)
  t.true(typeof body === 'object')
  t.true(body.name === 'test')
  t.true(body.email === 'test')
  t.true(body.picture === 'test')
})

test.serial('POST /team 401 (user)', async (t) => {
  const { userSession } = t.context
  const { status } = await request(app())
    .post('/')
    .send({ access_token: userSession })
  t.true(status === 401)
})

test.serial('POST /team 401', async (t) => {
  const { status } = await request(app())
    .post('/')
  t.true(status === 401)
})

test.serial('GET /team 200', async (t) => {
  const { status, body } = await request(app())
    .get('/')
  t.true(status === 200)
  t.true(Array.isArray(body))
})

test.serial('GET /team/:id 200', async (t) => {
  const { team } = t.context
  const { status, body } = await request(app())
    .get(`/${team.id}`)
  t.true(status === 200)
  t.true(typeof body === 'object')
  t.true(body.id === team.id)
})

test.serial('GET /team/:id 404', async (t) => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  t.true(status === 404)
})

test.serial('PUT /team/:id 200 (user)', async (t) => {
  const { userSession, team } = t.context
  const { status, body } = await request(app())
    .put(`/${team.id}`)
    .send({ access_token: userSession, name: 'test', email: 'test', picture: 'test' })
  t.true(status === 200)
  t.true(typeof body === 'object')
  t.true(body.id === team.id)
  t.true(body.name === 'test')
  t.true(body.email === 'test')
  t.true(body.picture === 'test')
})

test.serial('PUT /team/:id 401', async (t) => {
  const { team } = t.context
  const { status } = await request(app())
    .put(`/${team.id}`)
  t.true(status === 401)
})

test.serial('PUT /team/:id 404 (user)', async (t) => {
  const { userSession } = t.context
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: userSession, name: 'test', email: 'test', picture: 'test' })
  t.true(status === 404)
})

test.serial('DELETE /team/:id 204 (admin)', async (t) => {
  const { adminSession, team } = t.context
  const { status } = await request(app())
    .delete(`/${team.id}`)
    .query({ access_token: adminSession })
  t.true(status === 204)
})

test.serial('DELETE /team/:id 401 (user)', async (t) => {
  const { userSession, team } = t.context
  const { status } = await request(app())
    .delete(`/${team.id}`)
    .query({ access_token: userSession })
  t.true(status === 401)
})

test.serial('DELETE /team/:id 401', async (t) => {
  const { team } = t.context
  const { status } = await request(app())
    .delete(`/${team.id}`)
  t.true(status === 401)
})

test.serial('DELETE /team/:id 404 (admin)', async (t) => {
  const { adminSession } = t.context
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: adminSession })
  t.true(status === 404)
})
