export interface cookieOptions {
  maxAge: Number;
  expires: Date;
  httpOnly: Boolean;
  secure: Boolean;
  sameSite: 'boolean' | 'strict' | 'lax' | 'none';
}
