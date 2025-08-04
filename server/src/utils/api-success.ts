

export default function apiSuccess<T>(statusCode: number, data: T,  message='Success') {
    return {
        statusCode,
        message,
        data
    }
}