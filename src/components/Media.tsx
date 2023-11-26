import { Box } from "@mui/material";
import Link from "next/link";

export default function Media() {
  const mediaList = [
    {
      title: "代码",
      linkText: "Github",
      link: "https://github.com/vectorisvector/inscription",
    },
    {
      title: "开发者",
      linkText: "@cybervector_",
      link: "https://twitter.com/cybervector_",
    },
    {
      title: "Alpha",
      linkText: "@ChaunceyCrypto",
      link: "https://twitter.com/ChaunceyCrypto",
    },
  ];

  return (
    <div className=" flex items-center justify-center gap-x-4 py-4 max-sm:flex-col">
      {mediaList.map(({ title, linkText, link }) => {
        return (
          <div
            key={title}
            className=" flex items-center gap-2 text-xl"
          >
            <span>{title}:</span>
            <Box
              component={Link}
              href={link}
              className=" hover:underline"
              sx={{
                color: "primary.main",
              }}
            >
              {linkText}
            </Box>
          </div>
        );
      })}
    </div>
  );
}
