import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { session } from '../../services/passport'
import { create, index, show, update, destroy } from './service.controller'
import { schema } from './service.model'
export Service, { schema } from './service.model'

const router = new Router()
const { nome, descricao, status } = schema.tree

/**
 * @api {post} /service Create service
 * @apiName CreateService
 * @apiGroup Service
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam nome Service's nome.
 * @apiParam descricao Service's descricao.
 * @apiParam status Service's status.
 * @apiSuccess {Object} service Service's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Service not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  session({ required: true, roles: ['admin'] }),
  body({ nome, descricao, status }),
  create)

/**
 * @api {get} /service Retrieve services
 * @apiName RetrieveServices
 * @apiGroup Service
 * @apiUse listParams
 * @apiSuccess {Object[]} services List of services.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /service/:id Retrieve service
 * @apiName RetrieveService
 * @apiGroup Service
 * @apiSuccess {Object} service Service's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Service not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /service/:id Update service
 * @apiName UpdateService
 * @apiGroup Service
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam nome Service's nome.
 * @apiParam descricao Service's descricao.
 * @apiParam status Service's status.
 * @apiSuccess {Object} service Service's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Service not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  session({ required: true }),
  body({ nome, descricao, status }),
  update)

/**
 * @api {delete} /service/:id Delete service
 * @apiName DeleteService
 * @apiGroup Service
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Service not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  session({ required: true, roles: ['admin'] }),
  destroy)

export default router
