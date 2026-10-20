import Link from "next/link";
import { WebsitePreview } from "./examples";
import { StudioHero } from "./studio-experience";
import { ServiceIcon } from "./service-icon";
import s from "./marketing.module.css";

export function SalesHero({ language = "en" }: { language?: "en" | "id" }) {
  const en = language === "en";
  if (!en) return <StudioHero />;
  const details = en
    ? ["Your rooms", "A direct enquiry", "Your own website"]
    : ["Informasi usaha", "Kontak langsung", "Website milik Anda"];
  return (
    <section className={s.salesHero}>
      <div className={s.heroHeading}>
        <h1>
          {en ? "A place worth" : "Butuh website"}
          <br />
          <span>{en ? "discovering." : "untuk usaha Anda?"}</span>
        </h1>
      </div>
      <div className={s.heroIntro}>
        <p className={s.heroCopy}>
          {en
            ? "Bring your property's character online. Show your rooms, answer guests' questions and make the next step simple."
            : "Kami bantu buatkan, mulai Rp750 ribu. Bisa untuk menampilkan produk, menjelaskan layanan, atau menerima pertanyaan pelanggan. Kalau pencatatan pesanan juga perlu dibenahi, kita bahas sistem yang sesuai."}
        </p>
        <div className={s.actions}>
          {en ? (
            <Link className={s.button} href="/review">
              Get a free website review <span aria-hidden="true">↗</span>
            </Link>
          ) : (
            <a className={s.button} href="#pricing">
              Lihat paket UMKM <span aria-hidden="true">↗</span>
            </a>
          )}
          <a href="#examples" className={s.textLink}>
            {en ? "Explore the designs" : "Lihat contoh desain"}
          </a>
        </div>
        <p className={s.caption}>
          {en
            ? "A one-page review. By email in two working days. No obligation."
            : "Melayani seluruh Indonesia · Uang muka 50% · Total biaya disepakati sejak awal."}
        </p>
      </div>
      <div className={s.heroShowcase}>
        {en ? <div className={s.showcaseNotes}>
          <h2>
            {en
              ? "A little of your world. Online."
              : "Pelanggan bisa lihat dulu, lalu menghubungi Anda."}
          </h2>
          <p>
            {en
              ? "Villa Mare · Fictional guesthouse concept"
              : "Menu, daftar layanan, katalog produk dan kontak usaha bisa dikumpulkan di satu tempat."}
          </p>
          <ul>
            {details.map((detail, index) => (
              <li key={detail}>
                <ServiceIcon
                  kind={
                    index === 0
                      ? "layout"
                      : index === 1
                        ? "message"
                        : "handover"
                  }
                />
                {detail}
              </li>
            ))}
          </ul>
          <p className={s.visualCaption}>
            {en
              ? "AI-generated concept imagery. Not a client project."
              : "Contoh susunan website. Nama usaha dan isinya fiktif."}
          </p>
        </div> : null}
        <WebsitePreview language={language} />
      </div>
    </section>
  );
}
