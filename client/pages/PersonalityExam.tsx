import React from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { PersonalityTest } from "@/components/PersonalityTest";
import { useNavigate } from "react-router-dom";

export default function PersonalityExamPage(){
  const navigate = useNavigate();
  return (
    <MobileLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <PersonalityTest examMode onComplete={(p)=>{ try{ localStorage.setItem('personality-profile', JSON.stringify(p)); }catch{} navigate('/ayarlar'); }} onClose={() => navigate('/ayarlar')} />
      </div>
    </MobileLayout>
  );
}
