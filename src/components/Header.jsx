import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/userAuth";

export default function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

 const handleLogout = async () => {
    try {
      await api.post("/user/auth/logout");       
      setUser(null);
    } catch (err) {
      alert("로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <header className="w-full border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer text-xl font-black tracking-tight"
          >
            ONLIX
          </div>

          {/* 우측 아이콘 */}
          <div className="flex items-center gap-4 text-sm text-zinc-600">
            <button className="hover:text-zinc-900">검색</button>
            <button className="hover:text-zinc-900">마이</button>
            {user ? (
                <button onClick={handleLogout} className="hover:text-zinc-900">
                    로그아웃
                </button>
                ) : (
                <button onClick={() => navigate("/login")} className="hover:text-zinc-900">
                    로그인
                </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}