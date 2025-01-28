
export const JWT_SECRET = process.env.JWT_SECRET ?? "jwt_secret"
export interface userJwtClaims{
    id:string,
    name:string,
    email:string,
    username:string
}