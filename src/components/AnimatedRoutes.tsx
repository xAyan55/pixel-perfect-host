import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import Index from "@/pages/Index";
import GameHosting from "@/pages/GameHosting";
import MinecraftHosting from "@/pages/MinecraftHosting";
import HytaleHosting from "@/pages/HytaleHosting";
import TerrariaHosting from "@/pages/TerrariaHosting";
import VPSHosting from "@/pages/VPSHosting";
import WebHosting from "@/pages/WebHosting";
import BotHosting from "@/pages/BotHosting";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import AdminLogin from "@/pages/AdminLogin";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/get-started"
          element={
            <PageTransition>
              <GameHosting />
            </PageTransition>
          }
        />
        <Route
          path="/game-servers"
          element={
            <PageTransition>
              <GameHosting />
            </PageTransition>
          }
        />
        <Route
          path="/game-servers/minecraft"
          element={
            <PageTransition>
              <MinecraftHosting />
            </PageTransition>
          }
        />
        <Route
          path="/game-servers/hytale"
          element={
            <PageTransition>
              <HytaleHosting />
            </PageTransition>
          }
        />
        <Route
          path="/game-servers/terraria"
          element={
            <PageTransition>
              <TerrariaHosting />
            </PageTransition>
          }
        />
        <Route
          path="/cloud-vps"
          element={
            <PageTransition>
              <VPSHosting />
            </PageTransition>
          }
        />
        <Route
          path="/web-hosting"
          element={
            <PageTransition>
              <WebHosting />
            </PageTransition>
          }
        />
        <Route
          path="/bot-hosting"
          element={
            <PageTransition>
              <BotHosting />
            </PageTransition>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PageTransition>
              <PrivacyPolicy />
            </PageTransition>
          }
        />
        <Route
          path="/admin/login"
          element={
            <PageTransition>
              <AdminLogin />
            </PageTransition>
          }
        />
        <Route
          path="/admin"
          element={
            <PageTransition>
              <Admin />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};
