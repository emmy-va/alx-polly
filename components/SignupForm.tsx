export default function SignupForm() {
  return (
    <form className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-2">Sign Up</h2>
      <input type="text" placeholder="Name" className="border p-2 rounded" />
      <input type="email" placeholder="Email" className="border p-2 rounded" />
      <input type="password" placeholder="Password" className="border p-2 rounded" />
      <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">Sign Up</button>
      <p className="text-sm text-center mt-2">
        Already have an account? <a href="/login" className="text-green-600 hover:underline">Login</a>
      </p>
    </form>
  );
}
