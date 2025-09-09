import React from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { PersonalityTest } from "@/components/PersonalityTest";
import { useNavigate } from "react-router-dom";

export default function PersonalityExamPage(){
  const navigate = useNavigate();
  const [progress, setProgress] = React.useState({step:1,total:8});
  const [remaining, setRemaining] = React.useState<number|null>(null);

  // optional timer: 20 minutes default
  const TOTAL_SECONDS = 20 * 60;
  const [secondsLeft, setSecondsLeft] = React.useState(TOTAL_SECONDS);

  React.useEffect(()=>{
    const id = setInterval(()=>{
      setSecondsLeft(s => Math.max(0, s-1));
    },1000);
    return ()=> clearInterval(id);
  },[]);

  React.useEffect(()=>{
    if (secondsLeft === 0) {
      // if time out, navigate back to settings
      try{ const p = localStorage.getItem('personality-profile'); }catch{}
    }
  },[secondsLeft]);

  const onStepChange = React.useCallback((step:number,total:number)=>{
    setProgress({step: step+1, total});
  }, [setProgress]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-card to-background flex flex-col">
      <header className="sticky top-0 z-40 p-4 bg-white/5 backdrop-blur border-b">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Kişilik Sınavı</h1>
            <div className="text-xs text-muted-foreground">Sade sınav arayüzü — dikkat dağıtıcılar kaldırıldı</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{progress.step}/{progress.total}</div>
            <div className="text-xs text-muted-foreground">{Math.floor((secondsLeft%3600)/60).toString().padStart(2,'0')}:{String(secondsLeft%60).padStart(2,'0')}</div>
          </div>
        </div>
        <div className="max-w-md mx-auto mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${Math.round(((progress.step-1)/progress.total)*100)}%` }} />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-card rounded-3xl p-6 shadow-sm border">
            <PersonalityTest
              examMode
              onStepChange={onStepChange}
              onComplete={(p)=>{ try{ localStorage.setItem('personality-profile', JSON.stringify(p)); }catch{} navigate('/ayarlar'); }}
              onClose={() => navigate('/ayarlar')}
            />
          </div>
        </div>
      </main>

    </div>
  );
}
