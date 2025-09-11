import nccbg from "../assets/nccbg.jpg";

const Login = () => {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${nccbg})` }}
    >
      <p className="absolute top-8 left-8 text-white font-bold text-6xl tracking-widest">
        NCC
      </p>
      <div className="bg-black/20 backdrop-blur-lg border border-white/10 p-10 rounded-[20px] shadow-xl w-full max-w-md flex flex-col items-center justify-center min-h-[500px]">
        <h1 className="text-white font-bold text-4xl mb-8">LOGIN</h1>

        <form className="space-y-6 w-full">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-300 text-sm font-medium mb-2 tracking-widest"
            >
              USERNAME
            </label>

            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 bg-black/30 border-[2px] border-[#6435DD]/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6435DD]"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-300 text-sm font-medium mb-2 tracking-widest"
            >
              PASSWORD
            </label>

            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 bg-black/30 border-[2px] border-[#6435DD]/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6435DD]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#6435DD] border-[2px] border-[#6435DD]/50 text-white font-semibold mt-5 py-3 px-4 rounded-lg hover:bg-gray-900 hover:text-white hover:border-[#6435DD]/50 transition-colors tracking-widest cursor-pointer duration-300 text-lg"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
