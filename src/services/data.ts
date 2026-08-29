import type {
  ActivityLog,
  Article,
  Author,
  Category,
  Comment,
  Country,
  MediaItem,
  Notification,
  Stats,
  User,
  VisitorPoint
} from '@/types'
import { avatarImage, gradientImage } from './placeholder'
import { readingTime } from './format'

const AV = (i: number) => avatarImage(i)

const authors: Author[] = [
  { id: 'a1', name: 'Sokha Mony', username: 'sokhamony', avatar: AV(0), role: 'Editor', bio: 'Senior editor leading politics and national coverage.' },
  { id: 'a2', name: 'Dara Rith', username: 'dararith', avatar: AV(1), role: 'Author', bio: 'Investigative journalist.' },
  { id: 'a3', name: 'Theary Lin', username: 'thearylin', avatar: AV(2), role: 'Author', bio: 'Technology correspondent.' },
  { id: 'a4', name: 'Nita Chan', username: 'nitachan', avatar: AV(3), role: 'Author', bio: 'Business and economy reporter.' },
  { id: 'a5', name: 'Alex Bradley', username: 'alexbrad', avatar: AV(4), role: 'Author', bio: 'International affairs writer.' },
  { id: 'a6', name: 'Yuki Kimura', username: 'yukikimura', avatar: AV(5), role: 'Author', bio: 'Asia-Pacific editor.' },
  { id: 'a7', name: 'Meng Prak', username: 'mengprak', avatar: AV(6), role: 'Editor', bio: 'Sports desk editor.' },
  { id: 'a8', name: 'Jasmine Su', username: 'jasminesu', avatar: AV(7), role: 'Author', bio: 'Education & culture reporter.' },
  { id: 'a9', name: 'Chann Wath', username: 'channwath', avatar: AV(8), role: 'Admin', bio: 'Entertainment editor.' },
  { id: 'a10', name: 'Rithy Hong', username: 'rithyhong', avatar: AV(9), role: 'Author', bio: 'Multimedia journalist.' }
]

const categories: Category[] = [
  { id: 'c1', name: 'National', slug: 'national', color: '#4f46e5', description: 'News from across the country', articleCount: 0 },
  { id: 'c2', name: 'International', slug: 'international', color: '#0891b2', description: 'World news and global affairs', articleCount: 0 },
  { id: 'c3', name: 'Politics', slug: 'politics', color: '#7c3aed', description: 'Government & political coverage', articleCount: 0 },
  { id: 'c4', name: 'Technology', slug: 'technology', color: '#2563eb', description: 'Tech, startups and innovation', articleCount: 0 },
  { id: 'c5', name: 'Business', slug: 'business', color: '#059669', description: 'Economy, finance and markets', articleCount: 0 },
  { id: 'c6', name: 'Sports', slug: 'sports', color: '#ea580c', description: 'Sports news and scores', articleCount: 0 },
  { id: 'c7', name: 'Education', slug: 'education', color: '#0d9488', description: 'Learning and scholarships', articleCount: 0 },
  { id: 'c8', name: 'Entertainment', slug: 'entertainment', color: '#db2777', description: 'Movies, music and culture', articleCount: 0 }
]

function body(lead: string, points: string[], quote: string, section2: string): string {
  return [
    `<p>${lead}</p>`,
    `<h2>Key developments</h2>`,
    `<ul>${points.map((p) => `<li>${p}</li>`).join('')}</ul>`,
    `<blockquote>${quote}</blockquote>`,
    `<h2>What happens next</h2>`,
    `<p>${section2}</p>`,
    `<p>Officials say further announcements are expected in the coming weeks, with a follow-up briefing scheduled before the end of the quarter. Analysts are watching closely as the situation continues to develop across the region, with early signs pointing toward a sustained period of engagement between the parties involved and international observers.</p>`
  ].join('')
}

interface ArticleSeed {
  title: string
  thumb: number
  categoryId: string
  category: string
  scope: 'national' | 'international'
  country?: string
  province?: string
  tag: string
  author: number
  daysAgo: number
  views: number
  likes: number
  comments: number
  featured?: boolean
  breaking?: boolean
  video?: boolean
  status: Article['status']
}

const seeds: ArticleSeed[] = [
  { title: 'Government unveils new digital economy roadmap for Southeast Asia', thumb: 0, categoryId: 'c1', category: 'National', scope: 'national', country: 'kh', province: 'Phnom Penh', tag: 'Economy', author: 0, daysAgo: 0, views: 14820, likes: 320, comments: 84, featured: true, breaking: true, status: 'published' },
  { title: 'Breakthrough semiconductor plant opens — a regional first', thumb: 1, categoryId: 'c4', category: 'Technology', scope: 'international', country: 'us', tag: 'Technology', author: 2, daysAgo: 1, views: 11240, likes: 410, comments: 96, featured: true, breaking: true, status: 'published' },
  { title: 'Historic climate deal reached at global summit in Geneva', thumb: 2, categoryId: 'c2', category: 'International', scope: 'international', country: 'eu', tag: 'Climate', author: 4, daysAgo: 1, views: 9740, likes: 285, comments: 122, featured: true, status: 'published' },
  { title: 'National football team secures historic win in regional cup', thumb: 3, categoryId: 'c6', category: 'Sports', scope: 'national', country: 'kh', tag: 'Sports', author: 6, daysAgo: 2, views: 15840, likes: 870, comments: 204, featured: true, status: 'published' },
  { title: 'City launches smart transit pilot with electric bus fleet', thumb: 4, categoryId: 'c1', category: 'National', scope: 'national', province: 'Phnom Penh', country: 'kh', tag: 'Infrastructure', author: 1, daysAgo: 2, views: 6230, likes: 142, comments: 33, status: 'published' },
  { title: 'Export volumes hit record high in first half of the year', thumb: 5, categoryId: 'c5', category: 'Business', scope: 'national', country: 'kh', tag: 'Trade', author: 3, daysAgo: 3, views: 5120, likes: 118, comments: 27, status: 'published' },
  { title: 'Parliament approves landmark education reform package', thumb: 6, categoryId: 'c7', category: 'Education', scope: 'national', country: 'kh', tag: 'Education', author: 7, daysAgo: 3, views: 4310, likes: 195, comments: 41, status: 'published' },
  { title: 'Major banks announce new fintech integration for cross-border payments', thumb: 7, categoryId: 'c5', category: 'Business', scope: 'international', country: 'us', tag: 'Fintech', author: 3, daysAgo: 4, views: 6890, likes: 97, comments: 19, status: 'published' },
  { title: 'Tech giants commit to AI safety framework in joint statement', thumb: 8, categoryId: 'c4', category: 'Technology', scope: 'international', country: 'us', tag: 'AI', author: 2, daysAgo: 4, views: 10240, likes: 356, comments: 88, video: true, status: 'published' },
  { title: 'Province Bordeaux announces renewable energy cooperation with Asian partners', thumb: 9, categoryId: 'c2', category: 'International', scope: 'international', country: 'eu', tag: 'Energy', author: 4, daysAgo: 5, views: 3870, likes: 82, comments: 15, status: 'published' },
  { title: 'Silicon Valley startup valued at $9B after new funding round', thumb: 10, categoryId: 'c4', category: 'Technology', scope: 'international', country: 'us', tag: 'Startups', author: 2, daysAgo: 5, views: 7340, likes: 224, comments: 51, status: 'published' },
  { title: 'Rice exports surge as new trade corridor opens to Asia', thumb: 11, categoryId: 'c1', category: 'National', scope: 'national', province: 'Battambang', country: 'kh', tag: 'Agriculture', author: 1, daysAgo: 6, views: 2950, likes: 76, comments: 12, status: 'published' },
  { title: 'Elections set for spring with expanded youth participation initiative', thumb: 0, categoryId: 'c3', category: 'Politics', scope: 'national', country: 'kh', tag: 'Elections', author: 0, daysAgo: 6, views: 8210, likes: 133, comments: 74, status: 'published' },
  { title: 'Japan and Korea sign landmark economic partnership agreement', thumb: 1, categoryId: 'c2', category: 'International', scope: 'international', country: 'jp', tag: 'Trade', author: 5, daysAgo: 7, views: 6480, likes: 158, comments: 36, video: true, status: 'published' },
  { title: 'Host cities revealed for 2028 regional games', thumb: 2, categoryId: 'c6', category: 'Sports', scope: 'international', country: 'asean', tag: 'Sports', author: 6, daysAgo: 7, views: 5210, likes: 268, comments: 42, status: 'published' },
  { title: 'Beijing accelerates green transport transition in major cities', thumb: 3, categoryId: 'c2', category: 'International', scope: 'international', country: 'cn', tag: 'Climate', author: 5, daysAgo: 8, views: 4330, likes: 105, comments: 30, status: 'published' },
  { title: 'Rural broadband expansion reaches every district in the country', thumb: 4, categoryId: 'c4', category: 'Technology', scope: 'national', country: 'kh', tag: 'Internet', author: 2, daysAgo: 8, views: 4870, likes: 174, comments: 22, status: 'published' },
  { title: 'Currency markets react calmly to central bank rate decision', thumb: 5, categoryId: 'c5', category: 'Business', scope: 'national', country: 'kh', tag: 'Markets', author: 3, daysAgo: 9, views: 3660, likes: 88, comments: 17, status: 'published' },
  { title: 'New expressway cuts travel time to Siem Reap in half', thumb: 6, categoryId: 'c1', category: 'National', scope: 'national', province: 'Siem Reap', country: 'kh', tag: 'Infrastructure', author: 1, daysAgo: 9, views: 9100, likes: 312, comments: 58, featured: true, status: 'published' },
  { title: 'ASEAN ministers agree to streamline digital customs framework', thumb: 7, categoryId: 'c2', category: 'International', scope: 'international', country: 'asean', tag: 'ASEAN', author: 5, daysAgo: 10, views: 4120, likes: 91, comments: 14, status: 'published' },
  { title: 'Global markets post weekly gains as inflation cools', thumb: 8, categoryId: 'c5', category: 'Business', scope: 'international', country: 'us', tag: 'Markets', author: 3, daysAgo: 10, views: 5430, likes: 122, comments: 29, status: 'published' },
  { title: 'Film festival announces lineup featuring indie works from 40 countries', thumb: 9, categoryId: 'c8', category: 'Entertainment', scope: 'international', country: 'eu', tag: 'Film', author: 8, daysAgo: 11, views: 3560, likes: 210, comments: 24, status: 'published' },
  { title: 'University launches fully-funded scholarship program for STEM students', thumb: 10, categoryId: 'c7', category: 'Education', scope: 'national', country: 'kh', tag: 'Scholarships', author: 7, daysAgo: 11, views: 4680, likes: 244, comments: 38, status: 'published' },
  { title: 'Major cloud providers announce new data center in the region', thumb: 11, categoryId: 'c4', category: 'Technology', scope: 'international', country: 'asia', tag: 'Cloud', author: 2, daysAgo: 12, views: 6870, likes: 186, comments: 44, video: true, status: 'published' },
  { title: 'Trade fair opens with record participation from 60 nations', thumb: 0, categoryId: 'c5', category: 'Business', scope: 'national', country: 'kh', tag: 'Trade', author: 3, daysAgo: 12, views: 3980, likes: 84, comments: 19, status: 'published' },
  { title: 'New conservation program protects 2M hectares of forest', thumb: 1, categoryId: 'c1', category: 'National', scope: 'national', province: 'Kampot', country: 'kh', tag: 'Environment', author: 1, daysAgo: 13, views: 2870, likes: 168, comments: 21, status: 'published' },
  { title: 'European leaders meet to finalize digital single market rules', thumb: 2, categoryId: 'c2', category: 'International', scope: 'international', country: 'eu', tag: 'Politics', author: 4, daysAgo: 13, views: 4650, likes: 102, comments: 26, status: 'published' },
  { title: 'Winning goal controversy sparks debate over officiating reforms', thumb: 3, categoryId: 'c6', category: 'Sports', scope: 'national', country: 'kh', tag: 'Sports', author: 6, daysAgo: 14, views: 6120, likes: 208, comments: 97, status: 'published' },
  { title: 'Health ministry launches nationwide digital vaccination registry', thumb: 4, categoryId: 'c1', category: 'National', scope: 'national', province: 'Phnom Penh', country: 'kh', tag: 'Health', author: 0, daysAgo: 14, views: 5390, likes: 141, comments: 25, status: 'published' },
  { title: 'Korean pop culture festival draws fans from across the continent', thumb: 5, categoryId: 'c8', category: 'Entertainment', scope: 'international', country: 'kr', tag: 'Culture', author: 8, daysAgo: 15, views: 7240, likes: 498, comments: 112, status: 'published' },
  { title: 'Educators embrace AI tools to personalize student learning', thumb: 6, categoryId: 'c7', category: 'Education', scope: 'international', country: 'us', tag: 'AI', author: 7, daysAgo: 15, views: 5210, likes: 198, comments: 47, status: 'published' },
  { title: 'Tourism rebounds with record arrivals at coastal resorts', thumb: 7, categoryId: 'c5', category: 'Business', scope: 'national', province: 'Sihanoukville', country: 'kh', tag: 'Tourism', author: 3, daysAgo: 16, views: 7150, likes: 265, comments: 34, video: true, status: 'published' },
  { title: 'Space agency announces crewed mission to lunar orbit', thumb: 8, categoryId: 'c4', category: 'Technology', scope: 'international', country: 'us', tag: 'Space', author: 2, daysAgo: 16, views: 12840, likes: 682, comments: 210, breaking: true, status: 'published' },
  { title: 'Price controls lifted on staple goods to ease market pressure', thumb: 9, categoryId: 'c3', category: 'Politics', scope: 'national', country: 'kh', tag: 'Economy', author: 0, daysAgo: 17, views: 3980, likes: 88, comments: 43, status: 'published' },
  { title: 'Japanese automakers invest heavily in battery manufacturing hub', thumb: 10, categoryId: 'c5', category: 'Business', scope: 'international', country: 'jp', tag: 'Automotive', author: 5, daysAgo: 17, views: 4870, likes: 134, comments: 22, status: 'published' },
  { title: 'Community libraries reopen under new public reading initiative', thumb: 11, categoryId: 'c7', category: 'Education', scope: 'national', country: 'kh', tag: 'Culture', author: 7, daysAgo: 18, views: 1940, likes: 89, comments: 8, status: 'published' },
  { title: 'Streaming platform expands regional content library tenfold', thumb: 0, categoryId: 'c8', category: 'Entertainment', scope: 'international', country: 'asia', tag: 'Media', author: 8, daysAgo: 18, views: 3480, likes: 164, comments: 27, status: 'published' },
  { title: 'Draft anti-corruption bill enters public consultation phase', thumb: 1, categoryId: 'c3', category: 'Politics', scope: 'national', country: 'kh', tag: 'Governance', author: 0, daysAgo: 19, views: 4620, likes: 215, comments: 66, status: 'published' },
  { title: 'ASEAN digital economy projected to triple by 2030', thumb: 2, categoryId: 'c2', category: 'International', scope: 'international', country: 'asean', tag: 'Digital', author: 5, daysAgo: 19, views: 5420, likes: 176, comments: 31, video: true, status: 'published' },
  { title: 'National science fair highlights innovations by young engineers', thumb: 3, categoryId: 'c4', category: 'Technology', scope: 'national', country: 'kh', tag: 'Innovation', author: 2, daysAgo: 20, views: 2980, likes: 121, comments: 12, status: 'draft' },
  { title: 'Draft: Inside the making of a regional newsroom', thumb: 4, categoryId: 'c2', category: 'International', scope: 'international', country: 'eu', tag: 'Media', author: 9, daysAgo: 20, views: 0, likes: 0, comments: 0, status: 'draft' }
]

const articles: Article[] = seeds.map((s, i) => {
  const author = authors[s.author]
  const pub = new Date(Date.now() - s.daysAgo * 86400000).toISOString()
  const content = body(
    `Global authorities and industry leaders moved decisively this week as momentum builds around ${s.tag.toLowerCase()}, with early indicators pointing to a transformative period across the region. ${s.province ? `In ${s.province} and beyond, ` : ''}reports gathered from multiple sources paint a detailed picture of the developments unfolding.`,
    [
      `Initial estimates suggest the move could affect more than ${(s.views / 120).toFixed(0)} institutions and communities nationwide.`,
      `Regional leaders have signaled support for coordinated next steps within the existing regulatory framework.`,
      `Analysts note the timing aligns with broader trends observed across neighboring markets over recent months.`,
      `Stakeholders will be consulted before the final phase is implemented.`
    ],
    `"This represents a turning point — the decisions taken now will shape outcomes for years to come," said a senior official familiar with the matter.`,
    `${s.province ? s.province : s.country ? s.country.toUpperCase() : 'The region'} leads the way, yet questions remain about implementation timelines and long-term funding. Followers of the sector expect the roadmap to be revised as independent assessments are completed mid-year.`
  )
  return {
    id: `art-${i + 1}`,
    title: s.title,
    slug: `article-${i + 1}`,
    excerpt:
      s.title +
      '. A comprehensive look at the story as it develops, featuring expert analysis, official statements and on-the-ground reporting.',
    content,
    thumbnail: gradientImage(s.thumb, s.title),
    category: s.category,
    categoryId: s.categoryId,
    scope: s.scope,
    country: s.country,
    province: s.province,
    tags: [s.tag, s.category, s.scope === 'national' ? 'Cambodia' : 'World'],
    author,
    status: s.status,
    publishedAt: pub,
    views: s.views,
    likes: s.likes,
    commentsCount: s.comments,
    readTime: readingTime(content) + i % 2,
    isFeatured: s.featured,
    isBreaking: s.breaking,
    isVideo: s.video
  }
})

const users: User[] = [
  { id: 'u1', name: 'Sokha Mony', username: 'sokhamony', email: 'sokha@globalcms.com', avatar: AV(0), role: 'Super Admin', status: 'active', createdAt: '2023-01-15', savedArticles: ['art-1', 'art-2'], comments: ['cm-1'] },
  { id: 'u2', name: 'Dara Rith', username: 'dararith', email: 'dara@globalcms.com', avatar: AV(1), role: 'Admin', status: 'active', createdAt: '2023-02-20', savedArticles: ['art-3'], comments: [] },
  { id: 'u3', name: 'Theary Lin', username: 'thearylin', email: 'theary@globalcms.com', avatar: AV(2), role: 'Editor', status: 'active', createdAt: '2023-03-11', savedArticles: [], comments: ['cm-2'] },
  { id: 'u4', name: 'Nita Chan', username: 'nitachan', email: 'nita@globalcms.com', avatar: AV(3), role: 'Editor', status: 'active', createdAt: '2023-04-05', savedArticles: ['art-5'], comments: [] },
  { id: 'u5', name: 'Alex Bradley', username: 'alexbrad', email: 'alex@globalcms.com', avatar: AV(4), role: 'Author', status: 'active', createdAt: '2023-05-22', savedArticles: [], comments: ['cm-3'] },
  { id: 'u6', name: 'Yuki Kimura', username: 'yukikimura', email: 'yuki@globalcms.com', avatar: AV(5), role: 'Author', status: 'active', createdAt: '2023-07-02', savedArticles: [], comments: [] },
  { id: 'u7', name: 'Meng Prak', username: 'mengprak', email: 'meng@globalcms.com', avatar: AV(6), role: 'User', status: 'active', createdAt: '2023-09-18', savedArticles: ['art-2', 'art-8'], comments: ['cm-4'] },
  { id: 'u8', name: 'Jasmine Su', username: 'jasminesu', email: 'jasmine@globalcms.com', avatar: AV(7), role: 'User', status: 'pending', createdAt: '2024-01-09', savedArticles: [], comments: [] },
  { id: 'u9', name: 'Chann Wath', username: 'channwath', email: 'chann@globalcms.com', avatar: AV(8), role: 'Author', status: 'active', createdAt: '2024-02-14', savedArticles: [], comments: ['cm-5'] },
  { id: 'u10', name: 'Rithy Hong', username: 'rithyhong', email: 'rithy@globalcms.com', avatar: AV(9), role: 'User', status: 'suspended', createdAt: '2024-03-27', savedArticles: [], comments: ['cm-6'] }
]

const comments: Comment[] = [
  { id: 'cm-1', articleId: 'art-1', articleTitle: seeds[0].title, author: 'Sokha Mony', avatar: AV(0), content: 'Excellent, well-researched piece. The context on regional digital policy is very helpful for readers.', date: new Date(Date.now() - 3600e3 * 3).toISOString(), status: 'visible', likes: 18, parentId: null },
  { id: 'cm-2', articleId: 'art-2', articleTitle: seeds[1].title, author: 'Theary Lin', avatar: AV(2), content: 'Interesting breakdown of the semiconductor supply chain. Would love a follow-up on workforce impact.', date: new Date(Date.now() - 3600e3 * 8).toISOString(), status: 'visible', likes: 9, parentId: null },
  { id: 'cm-3', articleId: 'art-3', articleTitle: seeds[2].title, author: 'Alex Bradley', avatar: AV(4), content: 'The Geneva climate deal is a big step but implementation remains the hard part. Great summary.', date: new Date(Date.now() - 86400e3).toISOString(), status: 'pending', likes: 4, parentId: null },
  { id: 'cm-4', articleId: 'art-4', articleTitle: seeds[3].title, author: 'Meng Prak', avatar: AV(6), content: 'What a match! The team played with incredible discipline in the second half.', date: new Date(Date.now() - 86400e3 * 2).toISOString(), status: 'visible', likes: 43, parentId: null },
  { id: 'cm-5', articleId: 'art-33', articleTitle: seeds[32].title, author: 'Chann Wath', avatar: AV(8), content: 'This is clickbait. There is no evidence to support the headline claim as stated.', date: new Date(Date.now() - 86400e3 * 2).toISOString(), status: 'reported', likes: 1, parentId: null },
  { id: 'cm-6', articleId: 'art-12', articleTitle: seeds[11].title, author: 'Rithy Hong', avatar: AV(9), content: 'Great to see rice exports thriving. Farmers still need better price transparency though.', date: new Date(Date.now() - 86400e3 * 4).toISOString(), status: 'visible', likes: 12, parentId: null },
  { id: 'cm-7', articleId: 'art-9', articleTitle: seeds[8].title, author: 'Nita Chan', avatar: AV(3), content: 'The AI safety framework is largely voluntary — regulation still lags behind. Important read.', date: new Date(Date.now() - 86400e3 * 5).toISOString(), status: 'visible', likes: 7, parentId: null },
  { id: 'cm-8', articleId: 'art-19', articleTitle: seeds[18].title, author: 'Dara Rith', avatar: AV(1), content: 'The expressway will transform travel in the region. Impressive timeline from concept to completion.', date: new Date(Date.now() - 86400e3 * 6).toISOString(), status: 'pending', likes: 0, parentId: null },
  { id: 'cm-9', articleId: 'art-13', articleTitle: seeds[12].title, author: 'Sokha Mony', avatar: AV(0), content: 'The youth participation initiative is a promising step for civic engagement this election cycle.', date: new Date(Date.now() - 86400e3 * 7).toISOString(), status: 'visible', likes: 22, parentId: null }
]

const media: MediaItem[] = [
  { id: 'm1', name: 'hero-capital.jpg', url: gradientImage(0), type: 'image', size: '2.4 MB', mime: 'image/jpeg', uploadedBy: 'Sokha Mony', date: '2026-08-02', downloads: 142, width: 1920, height: 1080 },
  { id: 'm2', name: 'summit-geneva.png', url: gradientImage(2), type: 'image', size: '1.8 MB', mime: 'image/png', uploadedBy: 'Alex Bradley', date: '2026-08-03', downloads: 88, width: 1920, height: 1280 },
  { id: 'm3', name: 'stadium-cup.jpg', url: gradientImage(3), type: 'image', size: '3.1 MB', mime: 'image/jpeg', uploadedBy: 'Meng Prak', date: '2026-08-04', downloads: 233, width: 2560, height: 1440 },
  { id: 'm4', name: 'ai-summit-promo.mp4', url: gradientImage(8), type: 'video', size: '48 MB', mime: 'video/mp4', uploadedBy: 'Theary Lin', date: '2026-08-05', downloads: 61, duration: '02:48' },
  { id: 'm5', name: 'trade-corridor.jpg', url: gradientImage(11), type: 'image', size: '2.2 MB', mime: 'image/jpeg', uploadedBy: 'Nita Chan', date: '2026-08-06', downloads: 74, width: 1920, height: 1080 },
  { id: 'm6', name: 'expressway-aerial.jpg', url: gradientImage(6), type: 'image', size: '2.9 MB', mime: 'image/jpeg', uploadedBy: 'Dara Rith', date: '2026-08-07', downloads: 119, width: 1920, height: 1080 },
  { id: 'm7', name: 'kpop-festival.mp4', url: gradientImage(5), type: 'video', size: '62 MB', mime: 'video/mp4', uploadedBy: 'Chann Wath', date: '2026-08-08', downloads: 45, duration: '03:12' },
  { id: 'm8', name: 'product-launch.mp3', url: gradientImage(9), type: 'audio', size: '6.7 MB', mime: 'audio/mpeg', uploadedBy: 'Rithy Hong', date: '2026-08-09', downloads: 21, duration: '08:31' },
  { id: 'm9', name: 'annual-report-2026.pdf', url: '', type: 'document', size: '4.6 MB', mime: 'application/pdf', uploadedBy: 'Sokha Mony', date: '2026-08-10', downloads: 305 },
  { id: 'm10', name: 'solar-farm.jpg', url: gradientImage(1), type: 'image', size: '1.9 MB', mime: 'image/jpeg', uploadedBy: 'Alex Bradley', date: '2026-08-11', downloads: 67, width: 1920, height: 1080 },
  { id: 'm11', name: 'music-festival.jpg', url: gradientImage(10), type: 'image', size: '2.6 MB', mime: 'image/jpeg', uploadedBy: 'Chann Wath', date: '2026-08-12', downloads: 92, width: 1920, height: 1280 },
  { id: 'm12', name: 'launch-doc.docx', url: '', type: 'document', size: '1.1 MB', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uploadedBy: 'Nita Chan', date: '2026-08-13', downloads: 58 }
]

const notifications: Notification[] = [
  { id: 'n1', title: 'New comment reported', message: 'A comment on "Space agency announces crewed mission" was flagged by 3 readers.', type: 'warning', date: '2026-08-26T09:12:00', read: false },
  { id: 'n2', title: 'Article published', message: '"Space agency announces crewed mission to lunar orbit" is now live.', type: 'success', date: '2026-08-26T08:40:00', read: false },
  { id: 'n3', title: 'Comment awaiting approval', message: 'A new comment from "Alex Bradley" is pending moderation.', type: 'info', date: '2026-08-26T07:05:00', read: false },
  { id: 'n4', title: 'Storage quota nearly reached', message: 'Media library is at 82% of its allocated storage.', type: 'danger', date: '2026-08-25T16:30:00', read: true },
  { id: 'n5', title: 'New user registered', message: 'Jasmine Su signed up with the role "User".', type: 'info', date: '2026-08-25T11:22:00', read: true },
  { id: 'n6', title: 'Backup completed', message: 'Automated database backup finished successfully.', type: 'success', date: '2026-08-25T03:00:00', read: true }
]

const activityLogs: ActivityLog[] = [
  { id: 'l1', user: 'Sokha Mony', avatar: AV(0), action: 'Published article', entity: 'Space agency announces crewed mission', ip: '203.0.113.10', date: '2026-08-26T08:40:00' },
  { id: 'l2', user: 'Theary Lin', avatar: AV(2), action: 'Updated article', entity: 'Tech giants commit to AI safety framework', ip: '198.51.100.22', date: '2026-08-26T08:12:00' },
  { id: 'l3', user: 'Nita Chan', avatar: AV(3), action: 'Uploaded media', entity: 'trade-corridor.jpg', ip: '203.0.113.45', date: '2026-08-26T07:55:00' },
  { id: 'l4', user: 'Meng Prak', avatar: AV(6), action: 'Moderated comment', entity: 'Comment on "Winning goal controversy"', ip: '198.51.100.17', date: '2026-08-26T07:30:00' },
  { id: 'l5', user: 'Dara Rith', avatar: AV(1), action: 'Created category', entity: 'Entertainment', ip: '203.0.113.8', date: '2026-08-25T17:20:00' },
  { id: 'l6', user: 'Sokha Mony', avatar: AV(0), action: 'Updated settings', entity: 'SEO meta description', ip: '203.0.113.10', date: '2026-08-25T15:04:00' },
  { id: 'l7', user: 'Rithy Hong', avatar: AV(9), action: 'Deleted media', entity: 'old-promo-banner.jpg', ip: '198.51.100.60', date: '2026-08-25T12:44:00' },
  { id: 'l8', user: 'Jasmine Su', avatar: AV(7), action: 'Registered account', entity: 'New user', ip: '198.51.100.91', date: '2026-08-25T11:22:00' },
  { id: 'l9', user: 'Chann Wath', avatar: AV(8), action: 'Changed user role', entity: 'Rithy Hong → User', ip: '198.51.100.33', date: '2026-08-24T09:15:00' }
]

const countries: Country[] = [
  { code: 'us', name: 'USA', flag: '🇺🇸' },
  { code: 'eu', name: 'Europe', flag: '🇪🇺' },
  { code: 'asia', name: 'Asia', flag: '🌏' },
  { code: 'cn', name: 'China', flag: '🇨🇳' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'kr', name: 'Korea', flag: '🇰🇷' },
  { code: 'asean', name: 'ASEAN', flag: '🌏' },
  { code: 'kh', name: 'Cambodia', flag: '🇰🇭' }
]

const provinces: string[] = [
  'Phnom Penh',
  'Siem Reap',
  'Battambang',
  'Kampot',
  'Sihanoukville',
  'Kampong Cham',
  'Pursat',
  'Takeo'
]

const stats: Stats = {
  totalArticles: articles.filter((a) => a.status === 'published').length,
  nationalArticles: articles.filter((a) => a.scope === 'national').length,
  internationalArticles: articles.filter((a) => a.scope === 'international').length,
  users: users.length,
  views: articles.reduce((s, a) => s + a.views, 0),
  comments: comments.length,
  drafts: articles.filter((a) => a.status === 'draft').length
}

const visitorSeries: VisitorPoint[] = [
  { label: 'Mon', visitors: 8400, pageViews: 21000 },
  { label: 'Tue', visitors: 9200, pageViews: 23400 },
  { label: 'Wed', visitors: 8100, pageViews: 19800 },
  { label: 'Thu', visitors: 10500, pageViews: 26100 },
  { label: 'Fri', visitors: 9800, pageViews: 24300 },
  { label: 'Sat', visitors: 13200, pageViews: 31800 },
  { label: 'Sun', visitors: 12400, pageViews: 30200 }
]

const performanceSeries: number[] = [3200, 4100, 5400, 4800, 6900, 8200, 7610, 9400, 11200, 9860, 12800, 15400]

const growthSeries: number[] = [1200, 1380, 1520, 1810, 2100, 2330, 2680, 2940, 3310, 3650, 4020, 4480]

const trendingTopics: string[] = [
  'Digital Economy',
  'AI Regulation',
  'Climate Summit',
  'Smart Transit',
  'Regional Football',
  'Semiconductors',
  'Green Energy',
  'Education Reform',
  'ASEAN Trade',
  'Space Exploration'
]

export {
  activityLogs,
  articles,
  authors,
  categories,
  comments,
  countries,
  growthSeries,
  media,
  notifications,
  performanceSeries,
  provinces,
  stats,
  trendingTopics,
  users,
  visitorSeries
}