"use client";

import { useEffect, useState } from "react";
import { Clock3, ArrowLeft } from "lucide-react";
import { getTelegramInitData } from "./lib/telegram";
import type { Profile } from "./lib/types";
import { demoProfile } from "./lib/demo";
import TabBar, { Tab } from "./components/TabBar";
import ProfileScreen from "./components/ProfileScreen";
import TopScreen from "./components/TopScreen";
import QuestsScreen from "./components/QuestsScreen";
import ShopScreen from "./components/ShopScreen";
import PlayScreen from "./components/PlayScreen";

export default function Home() {
  const [p, setP] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("profile");

  // Когда не null — поверх текущей вкладки показываем чужой профиль
  // (открытый кликом по строке в топе), а не переключаем саму вкладку.
  const [viewedNickname, setViewedNickname] = useState<string | null>(null);
  const [viewedProfile, setViewedProfile] = useState<Profile | null>(null);
  const [viewedLoading, setViewedLoading] = useState(false);
  const [viewedError, setViewedError] = useState("");

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    tg?.ready();
    tg?.expand();

    fetch("/api/profile", { headers: { "X-Telegram-Init-Data": getTelegramInitData() } })
      .then(async (r) => {
        if (r.ok) return r.json();
        const body = await r.text().catch(() => "");
        throw new Error(`HTTP ${r.status}: ${body}`);
      })
      .then(setP)
      .catch((e) => {
        setP(demoProfile);
        setError(`Демо-профиль (ошибка API: ${e.message || e})`);
      })
      .finally(() => setLoading(false));
  }, []);

  function openPlayerProfile(nickname: string) {
    setViewedNickname(nickname);
    setViewedProfile(null);
    setViewedError("");
    setViewedLoading(true);
    fetch(`/api/profile/${encodeURIComponent(nickname)}`, {
      headers: { "X-Telegram-Init-Data": getTelegramInitData() },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setViewedProfile)
      .catch(() => setViewedError("Не удалось загрузить профиль этого игрока."))
      .finally(() => setViewedLoading(false));
  }

  function closePlayerProfile() {
    setViewedNickname(null);
    setViewedProfile(null);
    setViewedError("");
  }

  if (loading) return <LoadingShell />;

  const x = p!;

  return (
    <main className="cf-shell">
      <div className="cf-wrap">
        {viewedNickname ? (
          <>
            <button type="button" className="back-btn reveal" onClick={closePlayerProfile}>
              <ArrowLeft size={15} />
              Назад к топу
            </button>
            {viewedLoading && (
              <div className="card hero skeleton" style={{ height: 132 }} />
            )}
            {viewedError && (
              <div className="notice-pill reveal">
                <Clock3 size={14} />
                {viewedError}
              </div>
            )}
            {viewedProfile && <ProfileScreen profile={viewedProfile} />}
          </>
        ) : (
          <>
            {error && tab === "profile" && (
              <div className="notice-pill reveal">
                <Clock3 size={14} />
                {error}
              </div>
            )}

            {tab === "profile" && <ProfileScreen profile={x} />}
            {tab === "top" && <TopScreen selfNickname={x.nickname} onSelectPlayer={openPlayerProfile} />}
            {tab === "quests" && <QuestsScreen />}
            {tab === "shop" && <ShopScreen />}
            {tab === "play" && <PlayScreen />}
          </>
        )}

        <div className="tabbar-spacer" />
      </div>

      <TabBar active={tab} onChange={setTab} />
    </main>
  );
}

function LoadingShell() {
  return (
    <main className="cf-shell">
      <div className="cf-wrap">
        <div className="card hero skeleton" style={{ height: 132 }} />
        <div className="section-title" style={{ opacity: 0.4 }}>
          Рейтинг
        </div>
        <div className="card skeleton" style={{ height: 96 }} />
        <div className="section-title" style={{ opacity: 0.4 }}>
          Статистика
        </div>
        <div className="stat-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="card skeleton" key={i} style={{ height: 96 }} />
          ))}
        </div>
      </div>
    </main>
  );
}
