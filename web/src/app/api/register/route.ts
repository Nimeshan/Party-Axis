import { proxyPhpPost } from "@/lib/php-proxy";

export async function POST(req: Request) {
  return proxyPhpPost("/api/register.php", req);
}
