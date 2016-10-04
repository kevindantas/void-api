import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { session } from '../../services/passport'
import { create, index, show, update, destroy } from './gallery.controller'
import { schema } from './gallery.model'
export Gallery, { schema } from './gallery.model'

const router = new Router()
const { title, description, picture, tags } = schema.tree

/**
 * @api {post} /gallery Create gallery
 * @apiName CreateGallery
 * @apiGroup Gallery
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Gallery's title.
 * @apiParam description Gallery's description.
 * @apiParam picture Gallery's picture.
 * @apiParam tags Gallery's tags.
 * @apiSuccess {Object} gallery Gallery's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Gallery not found.
 * @apiError 401 user access only.
 */
router.post('/',
  session({ required: true }),
  body({ title, description, picture, tags }),
  create)

/**
 * @api {get} /gallery Retrieve galleries
 * @apiName RetrieveGalleries
 * @apiGroup Gallery
 * @apiUse listParams
 * @apiSuccess {Object[]} galleries List of galleries.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /gallery/:id Retrieve gallery
 * @apiName RetrieveGallery
 * @apiGroup Gallery
 * @apiSuccess {Object} gallery Gallery's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Gallery not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /gallery/:id Update gallery
 * @apiName UpdateGallery
 * @apiGroup Gallery
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Gallery's title.
 * @apiParam description Gallery's description.
 * @apiParam picture Gallery's picture.
 * @apiParam tags Gallery's tags.
 * @apiSuccess {Object} gallery Gallery's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Gallery not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  session({ required: true }),
  body({ title, description, picture, tags }),
  update)

/**
 * @api {delete} /gallery/:id Delete gallery
 * @apiName DeleteGallery
 * @apiGroup Gallery
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Gallery not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  session({ required: true }),
  destroy)

export default router
