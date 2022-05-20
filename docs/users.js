/**
 * @swagger
 * /users/sign-up:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     summary: 使用者註冊
 *     description: 使用者註冊
 *     operationId: replaceProduct
 *     parameters:
 *       - name: Bearer_Token
 *         type: string
 *         in: header
 *         required: true
 *       - name: productId
 *         in: path
 *         description: ID of product to return
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *       - name: name
 *         type: string
 *         in: body
 *         required: false
 *     responses:
 *        200:
 *          description: success
 *        400:
 *          description: error
 */
/**
 * @swagger
 * /users/sign-in:
 *  post:
 *    tags:
 *      - Users
 *    summary: 使用者登入
 *    description: 密碼限制為 8 ~ 20 字元，不能包含空白字元
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *              email:
 *                type: string
 *                example: abcd1234@abc.abc
 *              password:
 *                type: string
 *                example: abcd1234
 *    responses:
 *      200:
 *        description: 登入成功，回傳會員資訊，headers 中帶有 token
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: boolean
 *              example: true
 *            data:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: 阿明
 *                avatar:
 *                  type: string
 *                  example: 帥.jpg
 *                gender:
 *                  type: string
 *                  example: male
 *      401:
 *        description: 登入失敗
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: boolean
 *              example: false
 *            message:
 *              type: string
 *              example: 失敗原因
 */