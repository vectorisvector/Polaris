import { Box } from "@mui/material";

interface LogProps {
  title: string;
  logs: string[];
}
export default function Log({ title, logs }: LogProps) {
  return (
    <div className=" mt-5 flex flex-col gap-2">
      <span>{title}</span>
      <Box
        className=" flex h-[600px] flex-col gap-1 overflow-auto rounded-lg px-4 py-2"
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.grey[800]
              : theme.palette.grey[200],
          boxShadow: theme.shadows[1],
        })}
      >
        {logs.map((log, index) => (
          <div
            key={log + index}
            className=" flex items-center"
          >
            {log}
          </div>
        ))}
      </Box>
    </div>
  );
}
