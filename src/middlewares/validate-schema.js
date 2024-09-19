export function validateSchema(schema) {
  return async (req, res, next) => {
    const result = await schema.safeParseAsync(req.body)
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues })
    }
    req.body = result.data // <- puede que hay que cambiarlo luego
    next()
  }
}