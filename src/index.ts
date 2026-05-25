import "dotenv/config";
import { createApp } from "./app";

const port = process.env.PORT || 8100;

async function main() {
  const { server } = createApp();

  server.timeout = 10 * 60 * 1000;

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main();

