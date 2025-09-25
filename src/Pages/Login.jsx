import nccbg from "../assets/nccbg.jpg";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    event_id: 1,
    isjunior: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("first");
      const response = await axios.post(
        "http://localhost:3000/user/login",
        formData,
        { withCredentials: true }
      );

      console.log(response);

      if (response?.status === 200) {
        console.log("Login successful:", response.data);


        localStorage.setItem("currentUser", JSON.stringify(response.data.user));

        

        const enterFullscreen = async () => {
          const elem = document.documentElement;
          try {
            if (elem.requestFullscreen) await elem.requestFullscreen();
            else if (elem.webkitRequestFullscreen)
              await elem.webkitRequestFullscreen();
            else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
          } catch (err) {
            console.log("Fullscreen failed:", err);
          }
        };

        setTimeout(() => {
          enterFullscreen();
        }, 2000);

        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1000,
        });

        navigate("/instructions");
      }
    } catch (err) {
      console.log("Harshal ",err);
      if (err.response?.status === 501) {
        toast.error(err.response.data.message, {
          position: "top-center",
          autoClose: 2000,
        });
        navigate("/results");
        return;
      }

      if (err.response?.status === 400) {
        toast.error(err.response.data.error, {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      toast.error(err.response?.data?.error, {
        position: "top-center",
        autoClose: 2000,
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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

        <form className="space-y-6 w-full " onSubmit={handleSubmit}>
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
              autoComplete="off"
              required
              value={formData.username}
              className="w-full px-4 py-3 bg-black/30 border-[2px] border-[#6435DD]/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6435DD]"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
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
              required
              autoComplete="new-password"
              value={formData.password}
              className="w-full px-4 py-3 bg-black/30 border-[2px] border-[#6435DD]/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6435DD]"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="radio"
                name="level"
                value="junior"
                checked={formData.isjunior === true}
                onChange={() => setFormData({ ...formData, isjunior: true })}
                className="w-4 h-4 text-[#6435DD] border-gray-400 focus:ring-[#6435DD]"
              />
              Junior
            </label>

            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="radio"
                name="level"
                value="senior"
                checked={formData.isjunior === false}
                onChange={() => setFormData({ ...formData, isjunior: false })}
                className="w-4 h-4 text-[#6435DD] border-gray-400 focus:ring-[#6435DD]"
              />
              Senior
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#6435DD] border-[2px] border-[#6435DD]/50 text-white font-semibold mt-5 py-3 px-4 rounded-lg tracking-widest cursor-pointer duration-300 text-lg 
    ${
      loading
        ? "opacity-70 cursor-not-allowed"
        : "hover:bg-gray-900 hover:text-white hover:border-[#6435DD]/50"
    }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              "LOGIN"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
