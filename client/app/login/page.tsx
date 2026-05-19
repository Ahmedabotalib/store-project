export default function LoginPage() {
  return (

    <main className="min-h-screen bg-black flex items-center justify-center">

      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-2xl">

        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Welcome Back
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Login to your dashboard
        </p>

        <form className="space-y-5">

          {/* EMAIL */}

          <div>

            <label className="block text-sm text-zinc-300 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:border-white"
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="block text-sm text-zinc-300 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:border-white"
            />

          </div>

          {/* BUTTON */}

          <button
            className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Login
          </button>

        </form>

      </div>

    </main>

  );
}