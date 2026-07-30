import { VideoMetadata, TranscriptResult, TranscriptSegment } from '@/types/workout';
import { YoutubeTranscript } from 'youtube-transcript';

export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export async function fetchVideoMetadata(videoUrl: string): Promise<VideoMetadata> {
  const videoId = extractYouTubeId(videoUrl);
  if (!videoId) {
    throw new Error('无效的 YouTube URL 链接');
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(oembedUrl);
    
    if (res.ok) {
      const data = await res.json();
      return {
        platform: 'youtube',
        url: `https://www.youtube.com/watch?v=${videoId}`,
        video_id: videoId,
        title: data.title || 'YouTube Workout Video',
        channel_name: data.author_name || 'Fitness Creator',
        channel_url: data.author_url || `https://www.youtube.com/channel/${videoId}`,
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        duration_seconds: 900, // 15 mins estimated default for oembed
      };
    }
  } catch (e) {
    console.warn('oEmbed fetch failed, fallbacking to default metadata:', e);
  }

  // Fallback
  return {
    platform: 'youtube',
    url: `https://www.youtube.com/watch?v=${videoId}`,
    video_id: videoId,
    title: `YouTube Workout Video (${videoId})`,
    channel_name: 'Fitness Channel',
    channel_url: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    duration_seconds: 900,
  };
}

export async function fetchVideoTranscript(videoId: string): Promise<TranscriptResult> {
  try {
    const rawSegments = await YoutubeTranscript.fetchTranscript(videoId);
    if (rawSegments && rawSegments.length > 0) {
      const segments: TranscriptSegment[] = rawSegments.map((item: { offset: number; duration: number; text: string }) => ({
        start_seconds: Math.round((item.offset / 1000) * 10) / 10,
        end_seconds: Math.round(((item.offset + item.duration) / 1000) * 10) / 10,
        text: item.text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
      }));
      return {
        source_type: 'caption',
        language: 'en',
        segments
      };
    }
  } catch (err) {
    console.warn('youtube-transcript API error or no captions available:', err);
  }

  // Return empty result to allow fallback mock captions or manual paste in fallback mode
  return {
    source_type: 'caption',
    language: 'en',
    segments: []
  };
}
