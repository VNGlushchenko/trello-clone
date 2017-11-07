export class UserCredentials {
  private _user: string;
  private _token: string;

  get user(): string {
    return this._user;
  }

  set user(newUser: string) {
    this._user = newUser;
  }

  get token(): string {
    return this._token;
  }

  set token(newToken: string) {
    this._token = newToken;
  }
}
