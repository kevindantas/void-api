import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { session } from '../../services/passport'
import { create, index, show, update, destroy } from './team.controller'
import { schema } from './team.model'
export Team, { schema } from './team.model'

const router = new Router()
const { name, email, picture } = schema.tree

/**
 * @api {post} /team Create team
 * @apiName CreateTeam
 * @apiGroup Team
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam name Team's name.
 * @apiParam email Team's email.
 * @apiParam picture Team's picture.
 * @apiSuccess {Object} team Team's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Team not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  session({ required: true, roles: ['admin'] }),
  body({ name, email, picture }),
  create)

/**
 * @api {get} /team Retrieve teams
 * @apiName RetrieveTeams
 * @apiGroup Team
 * @apiUse listParams
 * @apiSuccess {Object[]} teams List of teams.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /team/:id Retrieve team
 * @apiName RetrieveTeam
 * @apiGroup Team
 * @apiSuccess {Object} team Team's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Team not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /team/:id Update team
 * @apiName UpdateTeam
 * @apiGroup Team
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Team's name.
 * @apiParam email Team's email.
 * @apiParam picture Team's picture.
 * @apiSuccess {Object} team Team's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Team not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  session({ required: true }),
  body({ name, email, picture }),
  update)

/**
 * @api {delete} /team/:id Delete team
 * @apiName DeleteTeam
 * @apiGroup Team
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Team not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  session({ required: true, roles: ['admin'] }),
  destroy)

export default router
