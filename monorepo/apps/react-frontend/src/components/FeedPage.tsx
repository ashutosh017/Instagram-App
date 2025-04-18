import { useState } from 'react';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Send } from 'lucide-react';

const InstagramFeed = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'adventurer',
      avatar: '/api/placeholder/32/32',
      image: '/api/placeholder/600/600',
      likes: 1234,
      caption: 'Beautiful sunset at the beach! 🌅 #nature #photography',
      comments: [
        { username: 'traveler', text: 'Stunning view! 😍' },
        { username: 'photoexpert', text: 'Great composition!' }
      ],
      liked: false,
      saved: false,
      timeAgo: '2 hours ago'
    },
    {
      id: 2,
      username: 'foodie',
      avatar: '/api/placeholder/32/32',
      image: '/api/placeholder/600/600',
      likes: 856,
      caption: 'Homemade pasta for dinner 🍝 #cooking #foodporn',
      comments: [
        { username: 'chef', text: 'Looks delicious!' },
        { username: 'italianfood', text: 'Perfect texture!' }
      ],
      liked: false,
      saved: false,
      timeAgo: '4 hours ago'
    }
  ]);

  const handleLike = (postId:any) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleSave = (postId:any) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          saved: !post.saved
        };
      }
      return post;
    }));
  };

  return (
    <div className="max-w-xl mx-auto bg-white">
      {posts.map(post => (
        <div key={post.id} className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <img 
                src={post.avatar} 
                alt={`${post.username}'s avatar`}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-semibold">{post.username}</span>
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </div>

          <img 
            src={post.image} 
            alt="Post content"
            className="w-full object-cover"
          />

          <div className="flex justify-between items-center p-4">
            <div className="flex space-x-4">
              <button 
                onClick={() => handleLike(post.id)}
                className="focus:outline-none"
              >
                <Heart 
                  className={`w-6 h-6 ${post.liked ? 'fill-red-500 text-red-500' : 'text-gray-800'}`}
                />
              </button>
              <button className="focus:outline-none">
                <MessageCircle className="w-6 h-6 text-gray-800" />
              </button>
              <button className="focus:outline-none">
                <Send className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            <button 
              onClick={() => handleSave(post.id)}
              className="focus:outline-none"
            >
              <Bookmark 
                className={`w-6 h-6 ${post.saved ? 'fill-gray-800 text-gray-800' : 'text-gray-800'}`}
              />
            </button>
          </div>

          <div className="px-4 font-semibold">
            {post.likes.toLocaleString()} likes
          </div>

          <div className="px-4 mt-2">
            <span className="font-semibold mr-2">{post.username}</span>
            {post.caption}
          </div>

          <div className="px-4 mt-2">
            {post.comments.map((comment, index) => (
              <div key={index} className="mt-1">
                <span className="font-semibold mr-2">{comment.username}</span>
                {comment.text}
              </div>
            ))}
          </div>

          <div className="px-4 mt-2 text-gray-500 text-sm">
            {post.timeAgo}
          </div>

          <div className="px-4 mt-4 flex items-center">
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full text-sm border-none focus:outline-none"
            />
            <button className="text-blue-500 font-semibold ml-2">Post</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InstagramFeed;