import type { RequestHandler } from '@sveltejs/kit';
import { TcClient } from '$lib/plm/teamcenter/tcClient';
import type { TenantConfig } from '$lib/types/config';
import { SqliteConfigRepo } from '$lib/server/repos/sqlite/configRepo.sqlite';

export const GET: RequestHandler = async ({ url, locals }) => {

  const uid = url.searchParams.get('uid');
  if (!uid) return new Response('Missing uid', { status: 400 });

  const configRepo = new SqliteConfigRepo();

  const tenantConfig: TenantConfig = await configRepo.getTenantConfig(locals.tenantId);


  if (!tenantConfig.plm || tenantConfig.plm.kind !== "teamcenter") {
    return new Response("Teamcenter not configured for tenant", { status: 400 });
  }

  const tcBaseUrl = tenantConfig.plm.baseUrl;

  const tc = new TcClient(tcBaseUrl);

  const { bytes, contentType } = await tc.getJpgPreviewBytes(uid);

  return new Response(bytes, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'no-store'
    }
  });
};
