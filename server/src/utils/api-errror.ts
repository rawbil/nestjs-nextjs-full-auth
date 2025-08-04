export default function ApiError(statusCode: number, message: 'Something exploded. Not your fault (probably)') {
  return { statusCode, message };
}
