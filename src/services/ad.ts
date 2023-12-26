import useSWR from "swr";

interface Ad {
  defaultImage: string;
  defaultUrl: string;
}

export const useAd = () => {
  const { data } = useSWR("images_ad", () => {
    return fetch(
      "https://raw.githubusercontent.com/vectorisvector/images/main/config.json",
    )
      .then((res) => res.json())
      .then((res) => res.ad as Ad);
  });

  return data;
};
