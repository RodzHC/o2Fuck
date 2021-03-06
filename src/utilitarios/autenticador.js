const apiBaseUrl = "/";

class Authenticator {
  construtor(envURL = "/") {
    this.envURL = envURL;
    this.isAdmin = false;
    this.isAuthenticated = false;
  }

  authenticate(callBack) {
    const req = {
      method: "POST",
      body: JSON.stringify({
        token: localStorage.getItem("auth-token")
      }),
      headers: new Headers({
        "Content-type": "application/json"
      })
    };

    fetch(`${this.envURL}api/autentica/token`, req)
      .then(res => {
        return res.json();
      })
      .then(mid => {
        if (mid.success === false) {
          const err = mid.message;
          throw new Error(err);
        } else if (mid.success === true) {
          this.isAuthenticated = true;
          if (mid.content.roles.admin === true) {
            this.isAdmin = true;
          }

          callBack();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  signout(callBack) {
    localStorage.setItem("auth-token", "");
    callBack();
  }
}

const Auth = {
  isAdmin: false,
  isAuthenticated: false,

  authenticate(resolve, reject) {
    const req = {
      method: "POST",
      body: JSON.stringify({
        token: localStorage.getItem("auth-token")
      }),
      headers: new Headers({
        "Content-type": "application/json"
      })
    };

    fetch(`${apiBaseUrl}api/autentica/token`, req)
      .then(res => {
        return res.json();
      })
      .then(mid => {
        if (mid.success === false) {
          reject();
          const err = mid.message;
          throw new Error(err);
        } else if (mid.success === true) {
          this.isAuthenticated = true;
          if (mid.content.roles.admin === true) {
            this.isAdmin = true;
          }

          resolve();
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  signout(callBack) {
    localStorage.setItem("auth-token", "");
    callBack();
  }
};

module.exports = Auth;
