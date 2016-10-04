import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Gallery } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Gallery.create({ ...body, user })
    .then((gallery) => gallery.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Gallery.find(query, select, cursor)
    .populate('user')
    .then((galleries) => galleries.map((gallery) => gallery.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Gallery.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((gallery) => gallery ? gallery.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Gallery.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((gallery) => gallery ? _.merge(gallery, body).save() : null)
    .then((gallery) => gallery ? gallery.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Gallery.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((gallery) => gallery ? gallery.remove() : null)
    .then(success(res, 204))
    .catch(next)
