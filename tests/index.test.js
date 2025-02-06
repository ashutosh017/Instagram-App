const axios2 = require("axios");
const { WebSocket } = require("ws");

const BACKEND_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:8080";

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
      username: username2,
      password: password2,
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
        username: "newusername69" + Math.random(),
        password: "password2",
        profilePic: "newprofilepic.com",
        about: "nothing in about",
        gender: "MALE",
        DOB: 29 / 11 / 2004,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });

  test("another user cannot be able to modify other user's profile", async () => {
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
        DOB: 29 / 11 / 2004,
      },
      {
        headers: {
          authorization: `Bearer ${anotherUserToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });

  test("user is able to change the password", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/users/password`,
      {
        newPassword: "newPassword",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(res.status).toBe(200);
  });

  test("get followers", async () => {
    const res = await axios.get(`${BACKEND_URL}/api/v1/users/followers`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test("get following", async () => {
    const res = await axios.get(`${BACKEND_URL}/api/v1/users/following`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test("get posts", async () => {
    console.log("another user id: ", anotherUserId);
    const res = await axios.get(
      `${BACKEND_URL}/api/v1/users/${anotherUserId}/posts?limit=10&offset=0`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });

  test("get feed", async () => {
    const res = await axios.get(`${BACKEND_URL}/api/v1/users/feed`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(res.status).toBe(200);
  });
});

describe("/posts endpoint", () => {
  let postId;
  let userId;
  let anotherUserId;
  let anotherUserToken;
  let token;
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
    const res2 = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = res2.data.token;
    const resp3 = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      name: name2,
      username: username2,
      password: password2,
      email: email2,
      profilePic: profilePic2,
    });

    anotherUserId = resp3.data.userId;

    const resp4 = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username2,
      password: password2,
    });
    anotherUserToken = resp4.data.token;
  });

  test("create or upload a post", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/posts/`,
      {
        postUrl: "posturl.com",
        description: "post description",
        tags: ["tag1", "tag2"],
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(200);
    postId = res.data.id;
  });

  test("like a post", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/posts/liked-posts`,
      {
        postId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });

  test("user is not able to like same post twice", async () => {
    const res2 = await axios.post(
      `${BACKEND_URL}/api/v1/posts/liked-posts`,
      {
        postId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res2.status).toBe(400);
  });

  test("Individual can see their liked posts", async () => {
    const res = await axios.get(`${BACKEND_URL}/api/v1/posts/liked-posts`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test("dislike a post ", async () => {
    console.log("post id: ", postId);
    const res = await axios.delete(`${BACKEND_URL}/api/v1/posts/liked-posts`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      data: { postId },
    });
    expect(res.status).toBe(200);
  });
  test("cannot dislike a post twice ", async () => {
    const res2 = await axios.delete(`${BACKEND_URL}/api/v1/posts/liked-posts`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      data: { postId },
    });
    expect(res2.status).toBe(400);
  });

  test("comment on a post", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/posts/comments`,
      {
        postId,
        comment: "your mean comment",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.data.id).toBeDefined();
    expect(res.status).toBe(200);
  });

  test("user cannot comment on a post that does not exist", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/posts/comments`,
      {
        postId: "lsdjkfjklsdf",
        comment: "your mean comment",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });

  test("share a post", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/posts/shares`,
      {
        postId,
        recipientIds: [anotherUserId],
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });

  test("delete a post", async () => {
    const createPostRes = await axios.post(
      `${BACKEND_URL}/api/v1/posts`,
      {
        postUrl: "posturl.com",
        description: "damn description",
        tags: ["tag1", "tag2"],
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    const postIdToDelete = createPostRes.data.id;
    console.log("postIdToDelete: ", postIdToDelete);
    const deletePostRes = await axios.delete(
      `${BACKEND_URL}/api/v1/posts/?postId=${postIdToDelete}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(deletePostRes.data.message);
    expect(deletePostRes.status).toBe(200);
    const deletePostRes2 = await axios.delete(
      `${BACKEND_URL}/api/v1/posts/?postId=${postIdToDelete}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(deletePostRes2.status).toBe(400);
  });

  test("save a post", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/posts/saved-posts`,
      {
        postId: postId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });

  test("get all saved posts", async () => {
    const res = await axios.get(`${BACKEND_URL}/api/v1/posts/saved-posts`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(res.data.posts).toBeDefined();
    expect(res.status).toBe(200);
  });

  // TODO: come back here
  test("un save a post", async () => {
    let PostId;
    const res1 = await axios.post(
      `${BACKEND_URL}/api/v1/posts/`,
      {
        postUrl: "posturl.com",
        description: "post description",
        tags: ["tag1", "tag2"],
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    PostId = res1.data.id;
    console.log(PostId);
    const res = await axios.delete(
      `${BACKEND_URL}/api/v1/posts/saved-posts?postId=${PostId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(postId);
    console.log(res.data.message);
    expect(res.status).toBe(200);
  });

  test("get post metadata", async () => {
    const res = await axios.get(`${BACKEND_URL}/api/v1/posts/${postId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test("update post", async () => {
    const createNewPostRes = await axios.post(
      `${BACKEND_URL}/api/v1/posts`,
      {
        postUrl: "postUrl.com",
        description: "klsdjfljk ",
        tags: ["tag1"],
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    const newPostId = createNewPostRes.data.id;
    const updatePostRes = await axios.put(
      `${BACKEND_URL}/api/v1/posts`,
      {
        postId: newPostId,
        postUrl: "newposturl.com",
        description: "new desc",
        tags: ["new tag"],
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("updatePostRes.data.message: ", updatePostRes.data.message);
    expect(updatePostRes.status).toBe(200);
  });

  test("other user cannot be able to update post of another person", async () => {
    const createNewPostRes = await axios.post(
      `${BACKEND_URL}/api/v1/posts`,
      {
        postUrl: "postUrl.com",
        description: "klsdjfljk ",
        tags: ["tag1"],
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    const newPostId = createNewPostRes.data.id;
    const updatePostRes = await axios.put(
      `${BACKEND_URL}/api/v1/posts`,
      {
        postId: newPostId,
        postUrl: "newposturl.com",
        description: "new desc",
        tags: ["new tag"],
      },
      {
        headers: {
          authorization: `Bearer ${anotherUserToken}`,
        },
      }
    );
    console.log("updatePostRes.data.message: ", updatePostRes.data.message);
    expect(updatePostRes.status).toBe(403);
  });
});

describe("other routes", () => {
  let postId;
  let userId;
  let anotherUserId;
  let anotherUserToken;
  let token;
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
    const res2 = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = res2.data.token;
    const resp3 = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      name: name2,
      username: username2,
      password: password2,
      email: email2,
      profilePic: profilePic2,
    });

    anotherUserId = resp3.data.userId;

    const resp4 = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username2,
      password: password2,
    });
    anotherUserToken = resp4.data.token;

    const createPostRes = await axios.post(
      `${BACKEND_URL}/api/v1/posts/`,
      {
        postUrl: "posturl.com",
        description: "post description",
        tags: ["tag1", "tag2"],
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    postId = createPostRes.data.id;
    const commentPostRes = await axios.post(
      `${BACKEND_URL}/api/v1/posts/comments`,
      {
        postId,
        comment: "your mean comment",
      },
      {
        headers: {
          authorization: `Bearer ${anotherUserToken}`,
        },
      }
    );
    commentId = commentPostRes.data.id;
  });
  test("reply to a comment", async () => {
    console.log(commentId);
    console.log(postId);
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/comments/replies`,
      {
        commentId,
        postId,
        reply: "your reply",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res.data.message);
    expect(res.status).toBe(200);
  });

  test("get all notfications", async () => {
    const res = await axios.get(
      `${BACKEND_URL}/api/v1/notifications?page=1&limit=10`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });

  test("user can see all their chats", async () => {
    const res = await axios.get(`${BACKEND_URL}/api/v1/chats/`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (res.data.chats.length > 0) {
      console.log(res.data.chats.length);
      console.log(res.data);
      expect(res.data.chats[0].id).toBeDefined();
    }
    expect(res.status).toBe(200);
  });

  test("get all messages of a perticular chat", async () => {
    const username = "name" + Math.random();
    const password = "password";
    const name = "name";
    const email = username + "@email.com";
    const profilePic = "https://profile-pic-url.com";
    const authorizedPersonSignup = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        name,
        username,
        password,
        email,
        profilePic,
      }
    );

    const authorizedPersonSignin = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username,
        password,
      }
    );
    const authorizedPersonsToken = authorizedPersonSignin.data.token;

    await axios.post(
      `${BACKEND_URL}/api/v1/users/${userId}/message`,
      {
        message: "hello ",
      },
      {
        headers: {
          authorization: `Bearer ${authorizedPersonsToken}`,
        },
      }
    );
    const res = await axios.get(`${BACKEND_URL}/api/v1/chats/`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const chatId = res.data.chats[0].id;
    const res2 = await axios.get(
      `${BACKEND_URL}/api/v1/chats/${chatId}/messages`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res2.status).toBe(200);
  });

  test("unauthorized person cannot see messages of other chats", async () => {
    const username = "name" + Math.random();
    const password = "password";
    const name = "name";
    const email = username + "@email.com";
    const profilePic = "https://profile-pic-url.com";
    const unauthorizedPersonSignup = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        name,
        username,
        password,
        email,
        profilePic,
      }
    );

    const unauthorizedPersonSignin = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username,
        password,
      }
    );
    const unauthorizedPersonsToken = unauthorizedPersonSignin.data.token;

    const res = await axios.get(`${BACKEND_URL}/api/v1/chats/`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const chatId = res.data.chats[0].id;
    const res2 = await axios.get(
      `${BACKEND_URL}/api/v1/chats/${chatId}/messages`,
      {
        headers: {
          authorization: `Bearer ${unauthorizedPersonsToken}`,
        },
      }
    );
    expect(res2.status).toBe(403);
  });
});

describe("Websockets tests", () => {
  const user1 = (() => {
    const name = "name1";
    const username = name + Math.random();
    const email = username + "@gmail.com";
  
    return {
      name,
      username,
      email,
      password: "password",
      profilePic: "https://profilepic.com",
    };
  })();
  const user2 = (() => {
    const name = "name2";
    const username = name + Math.random();
    const email = username + "@gmail.com";
  
    return {
      name,
      username,
      email,
      password: "password",
      profilePic: "https://profilepic.com",
    };
  })();
  let user1Id;
  let user1Token;
  let user2Id;
  let user2Token;
  let user1Socket;
  let user2Socket;
  beforeAll(async () => {
    console.log(user1)
    console.log(user2)
    const user1SignupRes = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      name:user1.name,
      email:user1.email,
      username:user1.username,
      password:user1.password,
      profilePic:user1.profilePic
    });
    const user2SignupRes = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      name:user2.name,
      email:user2.email,
      username:user2.username,
      password:user2.password,
      profilePic:user2.profilePic
    });
    const user1SigninRes = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: user1.username,
      password: user1.password,
    });
    const user2SigninRes = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: user2.username,
      password: user2.password,
    });
    console.log(user1SignupRes.data.message)
    console.log(user2SignupRes.data.message)
    console.log(user1SigninRes.data.message)
    console.log(user2SigninRes.data.message)
    expect(user1SignupRes.status).toBe(200)
    expect(user2SignupRes.status).toBe(200)
    expect(user1SigninRes.status).toBe(200)
    expect(user2SigninRes.status).toBe(200)

    user1Id = user1SignupRes.data.id
    user2Id = user2SignupRes.data.id

    user1Token = user1SigninRes.data.token;
    user2Token = user2SigninRes.data.token;

    user1Socket = new WebSocket(WS_URL+"?token="+user1Token)
    user2Socket = new WebSocket(WS_URL+"?token="+user2Token)

    await new Promise(r=>{
      user1Socket.onopen = r
    })
    await new Promise(r=>{
      user2Socket.onopen = r
    })
  });

  test.only("all events acknowledgement",async()=>{
    const events = ['NEW_MESSAGE', 'STATUS', 
      'FOLLOW', 'UNFOLLOW', 'LIKE', 'DISLIKE', 'COMMENT'
    ]
    events.forEach(e=>{
      let msg = {
        type:e,
        recipientId:user2Id,
        fromUserId:user1Id
      }
      if(e==='COMMENT'){
        msg.comment = "comment"
      }
      if(e==='NEW_MESSAGE'){
        msg.message="hello"
      }
      user2Socket.send(JSON.stringify(msg))
      user2Socket.onmessage = (data)=>{
        expect(data.type).toBe(e)
      }
    })
  })
});
