const { usernameAndPasswordReader } = require('./ensureAuth');

describe('ensureAuth middleware', () => {
  it('can read a username and password from the header', () => {
    const authorization = 'Basic Y2hlZXNlQGNoZWVzeS5jb206aG90Y2hlZXNlc2FtbXk=';
    expect(usernameAndPasswordReader(authorization)).toEqual({
      username: 'cheese@cheesy.com',
      password: 'hotcheesesammy'
    });
  });
});
