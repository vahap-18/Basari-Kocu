import React, { useState } from "react";

export const InfoFab: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-20 z-50 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg text-sm"
        aria-label="Bilgi"
      >
        ℹ️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-lg"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card rounded-2xl border p-4 z-10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">Hakkında</h3>
                <div className="text-sm text-muted-foreground">
                  Yazar: A. Vahap Doğan
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="px-2 py-1 rounded-xl border"
              >
                Kapat
              </button>
            </div>

            <div className="text-sm space-y-2">
              <p>
                Bu bir Acodex Academy projesidir. A. Vahap Doğan tarafından
                geliştirilmiştir.
              </p>
              <p>Projeye ve sosyal hesaplara buradan ulaşabilirsiniz:</p>
              <ul className="list-disc pl-5">
                <li>
                  <a
                    href="https://linktr.ee/acodex"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary"
                  >
                    Acodex Linktree
                  </a>
                </li>
              </ul>
              <div className="mt-3 text-xs text-muted-foreground">
                © Acodex Academy
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
