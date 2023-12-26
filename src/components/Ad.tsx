import Image from "next/image";
import Link from "next/link";

import { useAd } from "@/services/ad";

export default function Ad() {
  const ad = useAd();

  if (!ad) return null;

  return (
    <Link
      href={ad.defaultUrl}
      target="_blank"
      className=" relative mb-5 block h-80 overflow-hidden rounded-lg"
    >
      <Image
        src={ad.defaultImage}
        alt="ad"
        fill
      />
    </Link>
  );
}
