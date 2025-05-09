export default function (){

    return   <div className="absolute top-10 left-10 z-50 bg-white p-6 rounded shadow-lg border">
    <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
    <form className="flex flex-col gap-2">
      <input type="text" placeholder="Name" className="border p-2 rounded" />
      <input type="email" placeholder="Email" className="border p-2 rounded" />
      <input type="text" placeholder="Bio" className="border p-2 rounded" />
      <input type="text" placeholder="Profile pic link" className="border p-2 rounded" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
    </form>
  </div>
}