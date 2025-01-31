const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3001";

const axios = {
  post: async (...args) => {
    try {
      const res = await axios2.post(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  get: async (...args) => {
    try {
      const res = await axios2.get(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  put: async (...args) => {
    try {
      const res = await axios2.put(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  delete: async (...args) => {
    try {
      const res = await axios2.delete(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  patch: async (...args) => {
    try {
      const res = await axios2.patch(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
};

describe("Authentication", () => {
  test("user is able to signup ", async () => {
    const username = "name" + Math.random();
    const password = "password";
    const name = "name";
    const email = username + "@email.com";
    const profilePic = "https://profile-pic-url.com";
    const resp = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      name,
      username,
      password,
      email,
      profilePic,
    });

    expect(resp.status).toBe(200);

    const resp2 = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      name,
      username,
      password,
      email,
      profilePic,
    });
    expect(resp2.status).toBe(400);
  });
  test("user is not able to signup if any of the field is empty", async () => {
    const username = "name" + Math.random();
    const password = "password";
    const name = "name";
    const email = username + "@email.com";
    const res = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      name,
      email,
    });
    expect(res.status).toBe(400);
  });

  test("user is able to signin with correct credentials", async () => {
    const username = "name" + Math.random();
    const password = "password";
    const name = "name";
    const email = username + "@email.com";
    const profilePic = "https://profile-pic-url.com";
    const resp = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      name,
      username,
      password,
      email,
      profilePic,
    });

    expect(resp.status).toBe(200);
    const resp2 = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    expect(resp2.status).toBe(200);
    expect(resp2.data.token).toBeDefined();
  });

  test("signin fails if the details are incorrect", async () => {
    const username = "name" + Math.random();
    const password = "password";
    const resp = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    expect(resp.status).toBe(400);
  });
});

describe("/users endpoint", () => {
  let token;
  let userId;
  let anotherUserId;
  let anotherUserToken;
  const username = "name" + Math.random();
  const password = "password";
  const name = "name";
  const email = username + "@email.com";
  const profilePic = "https://profile-pic-url.com";

  const username2 = "name" + Math.random();
  const password2 = "password";
  const name2 = "name";
  const email2 = username2 + "@email.com";
  const profilePic2 = "https://profile-pic-url.com";

  beforeAll(async () => {
    const resp = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      name,
      username,
      password,
      email,
      profilePic,
    });
    userId = resp.data.userId;
    const resp2 = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = resp2.data.token;

    const resp3 = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      name: name2,
      username: username2,
      password: password2,
      email: email2,
      profilePic: profilePic2,
    });

    anotherUserId = resp3.data.userId;

    const resp4 = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username:username2,
      password:password2,
    });
    anotherUserToken = resp4.data.token;
    console.log("another user id: ", anotherUserId);
  });

  test("user is able to get users list with a name", async () => {
    const resp = await axios.get(
      `${BACKEND_URL}/api/v1/users/search?name=${name}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(resp.status).toBe(200);
  });

  test("user will not get users list if he doesn't provide name query param", async () => {
    const resp = await axios.get(`${BACKEND_URL}/api/v1/users/search?name=`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(resp.status).toBe(400);
  });

  test("user is able to get other users metadata by it's userId", async () => {
    console.log("another user id: ", anotherUserId);
    console.log("token: ", token);
    const res = await axios.get(
      `${BACKEND_URL}/api/v1/users/${anotherUserId}/metadata?limit=10&offset=0`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });

  test("user will not get any metadata of unknown userId", async () => {
    const unkownUserId = "fsdkljflsdjfjaskljfdklj";
    const res = await axios.get(
      `${BACKEND_URL}/api/v1/users/${unkownUserId}/metadata?limit=10&offset=0`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });

  test("follow req succeed", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/users/${anotherUserId}/followers`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });

  test("follow request failes if the userId is wrong", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/users/wrongUserId/followers`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });

  test("you are not able to follow same person twice", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/users/${anotherUserId}/followers`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });

  test("unfollow a user", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/api/v1/users/${anotherUserId}/followers`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });

  test("you are not able to unfollow the same user twice", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/api/v1/users/${anotherUserId}/followers`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });

  test("send message", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/users/${anotherUserId}/message`,
      {
        message: "hello another user",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(200);
    const res2 = await axios.post(
      `${BACKEND_URL}/api/v1/users/${anotherUserId}/message`,
      {
        message: "hello another user",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res2.status).toBe(200);
  });

  test("edit a profile", async () => {
    const res = await axios.put(
      `${BACKEND_URL}/api/v1/users/profile`,
      {
        name: "new name",
        email: `email${Math.random()}@gmail.com`,
        username: "newusername69"+Math.random(),
        password: "password2",
        profilePic: "newprofilepic.com",
        about: "nothing in about",
        gender: "MALE",
        DOB: 29/11/2004,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(200)
  });

  test("another user cannot be able to modify other user's profile",async()=>{
    const res = await axios.put(
      `${BACKEND_URL}/api/v1/users/profile`,
      {
        name: "new name",
        email: "newEmail@gmail.com",
        username: "newusername69",
        password: "password2",
        profilePic: "newprofilepic.com",
        about: "nothing in about",
        gender: "MALE",
        DOB: 29/11/2004,
      },
      {
        headers: {
          authorization: `Bearer ${anotherUserToken}`,
        },
      }
    );
    expect(res.status).toBe(400)    
  })

  test("user is able to change the password",async()=>{
    const res = await axios.post(`${BACKEND_URL}/api/v1/users/password`,{
      newPassword:"newPassword"
    },{
      headers:{
        authorization:`Bearer ${token}`
      }
    })

    expect(res.status).toBe(200)
  })

  test("get followers",async()=>{
    const res = await axios.get(`${BACKEND_URL}/api/v1/users/followers`,{
      headers:{
        authorization:`Bearer ${token}`
      }
    })
    expect(res.status).toBe(200)
  })

  test("get following",async()=>{
    const res = await axios.get(`${BACKEND_URL}/api/v1/users/following`,{
      headers:{
        authorization:`Bearer ${token}`
      }
    })
    expect(res.status).toBe(200)
  })
  
  test("get posts",async()=>{
    console.log("another user id: ",anotherUserId)
    const res = await axios.get(`${BACKEND_URL}/api/v1/users/${anotherUserId}/posts?limit=10&offset=0`,{
      headers:{
        authorization:`Bearer ${token}`
      }
    })
    expect(res.status).toBe(200)
  })

  test("get feed",async()=>{
    const res = await axios.get(`${BACKEND_URL}/api/v1/users/feed`,{
      headers:{
        authorization:`Bearer ${token}`
      }
    })
    expect(res.status).toBe(200)
  })
});

describe("/posts endpoint",()=>{
  
})
