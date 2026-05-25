import "dotenv/config";
import { createApp } from "./app";

const { app, server } = createApp();
const port = process.env.PORT || 8100;

if (!process.env.VERCEL) {
  server.timeout = 10 * 60 * 1000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
