import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MobileLayout } from "@/components/MobileLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <MobileLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-base text-muted-foreground mb-4">Sayfa bulunamadı</p>
          <a href="/" className="text-primary underline">
            Ana sayfaya dön
          </a>
        </div>
      </div>
    </MobileLayout>
  );
};

export default NotFound;
