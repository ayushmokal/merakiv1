import type { MetadataRoute } from 'next';
import { SITE_URL, STATIC_ROUTES } from '@/lib/seo';
import { PROJECT_SLUGS } from '@/data/projects';

const toAbsoluteUrl = (path: string) => (path === '/' ? SITE_URL : `${SITE_URL}${path}`);

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

const getPageChangeFrequency = (path: string): ChangeFrequency =>
  path === '/' ? 'weekly' : 'monthly';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pageEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: toAbsoluteUrl(path),
    lastModified,
    changeFrequency: getPageChangeFrequency(path),
    priority: path === '/' ? 1 : 0.8,
  }));

  const projectEntries: MetadataRoute.Sitemap = PROJECT_SLUGS.map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...pageEntries, ...projectEntries];
}
