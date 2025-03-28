
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-islamic-gold mb-6">404</h1>
        <p className="text-2xl text-gray-700 mb-6">Halaman Tidak Ditemukan</p>
        <p className="text-gray-600 mb-8">
          Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>
        <Link to="/">
          <Button className="bg-islamic-green hover:bg-islamic-green/90 flex items-center gap-2">
            <Home size={16} />
            <span>Kembali ke Beranda</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
