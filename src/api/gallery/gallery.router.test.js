import test from 'ava'
import Promise from 'bluebird'
import request from 'supertest-as-promised'
import mockgoose from 'mockgoose'
import { signSync } from '../../services/jwt'
import express from '../../config/express'
import mongoose from '../../config/mongoose'
import { User } from '../user'
import routes, { Gallery } from '.'

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
  const gallery = await Gallery.create({ user })
  t.context = { ...t.context, userSession, anotherSession, adminSession, gallery }
})

test.afterEach.always(async (t) => {
  await Promise.all([User.remove(), Gallery.remove()])
})

test.serial('POST /gallery 201 (user)', async (t) => {
  const { userSession } = t.context
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, title: 'test', description: 'test', picture: 'test', tags: 'test' })
  t.true(status === 201)
  t.true(typeof body === 'object')
  t.true(body.title === 'test')
  t.true(body.description === 'test')
  t.true(body.picture === 'test')
  t.true(body.tags === 'test')
  t.true(typeof body.user === 'object')
})

test.serial('POST /gallery 401', async (t) => {
  const { status } = await request(app())
    .post('/')
  t.true(status === 401)
})

test.serial('GET /gallery 200', async (t) => {
  const { status, body } = await request(app())
    .get('/')
  t.true(status === 200)
  t.true(Array.isArray(body))
})

test.serial('GET /gallery/:id 200', async (t) => {
  const { gallery } = t.context
  const { status, body } = await request(app())
    .get(`/${gallery.id}`)
  t.true(status === 200)
  t.true(typeof body === 'object')
  t.true(body.id === gallery.id)
})

test.serial('GET /gallery/:id 404', async (t) => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  t.true(status === 404)
})

test.serial('PUT /gallery/:id 200 (user)', async (t) => {
  const { userSession, gallery } = t.context
  const { status, body } = await request(app())
    .put(`/${gallery.id}`)
    .send({ access_token: userSession, title: 'test', description: 'test', picture: 'test', tags: 'test' })
  t.true(status === 200)
  t.true(typeof body === 'object')
  t.true(body.id === gallery.id)
  t.true(body.title === 'test')
  t.true(body.description === 'test')
  t.true(body.picture === 'test')
  t.true(body.tags === 'test')
  t.true(typeof body.user === 'object')
})

test.serial('PUT /gallery/:id 401 (user) - another user', async (t) => {
  const { anotherSession, gallery } = t.context
  const { status } = await request(app())
    .put(`/${gallery.id}`)
    .send({ access_token: anotherSession, title: 'test', description: 'test', picture: 'test', tags: 'test' })
  t.true(status === 401)
})

test.serial('PUT /gallery/:id 401', async (t) => {
  const { gallery } = t.context
  const { status } = await request(app())
    .put(`/${gallery.id}`)
  t.true(status === 401)
})

test.serial('PUT /gallery/:id 404 (user)', async (t) => {
  const { anotherSession } = t.context
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, title: 'test', description: 'test', picture: 'test', tags: 'test' })
  t.true(status === 404)
})

test.serial('DELETE /gallery/:id 204 (user)', async (t) => {
  const { userSession, gallery } = t.context
  const { status } = await request(app())
    .delete(`/${gallery.id}`)
    .query({ access_token: userSession })
  t.true(status === 204)
})

test.serial('DELETE /gallery/:id 401 (user) - another user', async (t) => {
  const { anotherSession, gallery } = t.context
  const { status } = await request(app())
    .delete(`/${gallery.id}`)
    .send({ access_token: anotherSession })
  t.true(status === 401)
})

test.serial('DELETE /gallery/:id 401', async (t) => {
  const { gallery } = t.context
  const { status } = await request(app())
    .delete(`/${gallery.id}`)
  t.true(status === 401)
})

test.serial('DELETE /gallery/:id 404 (user)', async (t) => {
  const { anotherSession } = t.context
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  t.true(status === 404)
})
