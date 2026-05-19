import HomeHero from "../../components/HomeHero/HomeHero";
import QuickAccess from "../../components/QuickAccess/QuickAccess";
import LatestOffers from "../../components/LatestOffers/LatestOffers";
import TelegramBanner from "../../components/TelegramBanner/TelegramBanner";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <QuickAccess />
      <LatestOffers />
      <TelegramBanner />
    </>
  );
}
