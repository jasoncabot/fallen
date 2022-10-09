import { loadProvinces } from "@fallen/shared";

export async function handleRequest(request: Request, env: Bindings) {
    const provinces = loadProvinces();
    return new Response(`There are ${Object.keys(provinces).length} provinces`);
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };

export default worker;
