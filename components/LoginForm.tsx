export default function LoginForm() {
  return (
    <form className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-2">Login</h2>
      <input type="email" placeholder="Email" className="border p-2 rounded" />
      <input type="password" placeholder="Password" className="border p-2 rounded" />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
      <p className="text-sm text-center mt-2">
        Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
      </p>
    </form>
  );
}
