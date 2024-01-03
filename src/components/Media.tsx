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
      title: "Discord",
      linkText: "111 避难所",
      link: "https://discord.gg/MkyQZnyeJF",
    },
  ];

  return (
    <div className=" py-4">
      <div className=" flex items-center justify-center gap-x-4 max-sm:flex-col">
        {mediaList.map(({ title, linkText, link }) => {
          return (
            <div
              key={title}
              className=" flex items-center gap-2"
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

      {/* <div className=" text-center">
        <span>广告位招租☕️, dm </span>
        <Box
          component={Link}
          href={"https://twitter.com/cybervector_"}
          className=" hover:underline"
          sx={{
            color: "primary.main",
          }}
        >
          @cybervector_
        </Box>
      </div> */}
    </div>
  );
}
